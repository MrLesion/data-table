const Events = (function () {
    'use strict';

    const arrDelegatedEventsByType = {}; // Stores delegated event listeners grouped by event type

    /**
     * Get the index of a specific listener within a type delegation array
     * @param  {Array}             arrTypeDelegations   The array of listeners for a given event type
     * @param  {String|Node}       strSelectorOrNode    The selector or DOM node the event is attached to
     * @param  {Function|Object}   fnCallback           The callback function or object with handleEvent
     * @return {Number}                                 The index of the matching listener, or -1 if not found
     */
    function getDelegationIndexByTypeAndSelectorAndCallback(arrTypeDelegations, strSelectorOrNode, fnCallback) {
        return arrTypeDelegations.findIndex((objDelegation) => {
            const isSameSelector = objDelegation.selector === strSelectorOrNode;
            const isSameCallback = objDelegation.callback === fnCallback;
            return isSameSelector === true && isSameCallback === true;
        });
    }


    /**
     * Get the actual DOM node that matched the delegation selector
     * @param  {Node}         nodeTarget           The event target node
     * @param  {String|Node}  strSelectorOrNode    The selector or node the event was delegated to
     * @return {Node}                              The matched node or null if not matched
     */
    function getDelegateTarget(nodeTarget, strSelectorOrNode) {
        let nodeReturnValue = null;
        if (typeof strSelectorOrNode !== 'string') {
            nodeReturnValue = strSelectorOrNode;
        } else {
            nodeReturnValue = nodeTarget.closest(strSelectorOrNode);
        }
        return nodeReturnValue;
    }

    /**
     * Check if the target matches the selector or is contained within it
     * @param  {Node}         nodeTarget           The event target node
     * @param  {String|Node}  strSelectorOrNode    The selector or node to test against
     * @return {Boolean}                           True if the target is contained by or matches the selector
     */
    function isTargetContainedBySelector(nodeTarget, strSelectorOrNode) {
        let boolReturnValue;
        if ([
            window,
            document,
        ].includes(strSelectorOrNode) === true) {
            boolReturnValue = true;
        } else if (typeof strSelectorOrNode !== 'string') {
            boolReturnValue = strSelectorOrNode === nodeTarget || strSelectorOrNode.contains(nodeTarget) === true;
        } else {
            boolReturnValue = nodeTarget.closest(strSelectorOrNode) !== null;
        }
        return boolReturnValue;
    }

    /**
     * Handle all delegated listeners for a fired event
     * @param {Event} objEvent The native event object
     */
    function handleEvent(objEvent) {
        if (arrDelegatedEventsByType[objEvent.type] !== undefined) {
            for (const objDelegatedEvent of arrDelegatedEventsByType[objEvent.type]) {
                if (isTargetContainedBySelector(objEvent.target, objDelegatedEvent.selector) === true) {
                    objEvent.delegateTarget = getDelegateTarget(objEvent.target, objDelegatedEvent.selector);
                    if (typeof objDelegatedEvent.callback === 'function') {
                        objDelegatedEvent.callback(objEvent);
                    } else if (typeof objDelegatedEvent.callback?.handleEvent === 'function') {
                        objDelegatedEvent.callback.handleEvent(objEvent);
                    }
                }
            }
        }
    }


    /**
     * Add one or more delegated event listeners
     * @param  {String}                         strEventTypes       The event type(s), comma-separated
     * @param  {String|Node|Document|Window}    strSelectorOrNode   The selector or node to delegate the event to
     * @param  {Function|Object}                fnCallback          The callback function or object with handleEvent
     * @param  {Boolean}                        boolOnce            Remove after first invocation
     */
    function on(strEventTypes, strSelectorOrNode, fnCallback, boolOnce = false) {
        for (let strEventType of strEventTypes.split(' ')) {
            strEventType = strEventType.trim();
            if (document.readyState !== 'loading' && strSelectorOrNode === document && strEventType === 'DOMContentLoaded') {
                fnCallback(new Event(strEventType));
            } else if (document.readyState === 'complete' && strSelectorOrNode === window && strEventType === 'load') {
                fnCallback(new Event(strEventType));
            } else {
                if (arrDelegatedEventsByType[strEventType] === undefined) {
                    arrDelegatedEventsByType[strEventType] = [];
                    window.addEventListener(strEventType, handleEvent, {
                        capture: true,
                        once: boolOnce,
                    });
                }
                // Register the delegated event
                arrDelegatedEventsByType[strEventType].push({
                    selector: strSelectorOrNode,
                    callback: fnCallback
                });
            }
        }
    }

    /**
     * Remove one or more delegated event listeners
     * @param  {String}                         strEventTypes       The event type(s), comma-separated
     * @param  {String|Node|Document|Window}    strSelectorOrNode   The selector or node to remove the event from
     * @param  {Function|Object}                fnCallback          The callback function or object with handleEvent
     */
    function off(strEventTypes, strSelectorOrNode, fnCallback) {
        // Loop through each event type
        for (let strEventType of strEventTypes.split(' ')) {
            strEventType = strEventType.trim();
            // Skip if the event type is not registered
            if (arrDelegatedEventsByType[strEventType] !== undefined) {
                // If only one listener or selector is missing, remove entire type
                if (arrDelegatedEventsByType[strEventType].length < 2 || strSelectorOrNode === undefined) {
                    delete arrDelegatedEventsByType[strEventType];
                    window.removeEventListener(strEventType, handleEvent, true);
                } else {
                    // Remove specific listener
                    const intIndex = getDelegationIndexByTypeAndSelectorAndCallback(arrDelegatedEventsByType[strEventType], strSelectorOrNode, fnCallback);
                    if (intIndex > -1) {
                        arrDelegatedEventsByType[strEventType].splice(intIndex, 1);
                    }
                }
            }
        }
    }

    /**
     * Add an event listener that automatically removes itself after the first run
     * @param  {String}   strEventTypes      The event type(s), comma-separated
     * @param  {String}   strSelectorOrNode  The selector or node to delegate the event to
     * @param  {Function} fnCallback         The function to run once when the event fires
     */
    function once(strEventTypes, strSelectorOrNode, fnCallback) {
        on(strEventTypes, strSelectorOrNode, fnCallback, true);
    }

    /**
     * Dispatch a standard or custom event
     * @param  {String|Event} anyEvent The event object or event name
     * @param  {Node}         domNode  The target DOM node
     * @return {Boolean}               True if the event was not canceled
     */
    function trigger(anyEvent, domNode) {
        const objEventToDispatch =
            typeof anyEvent === 'string'
                ? new Event(anyEvent, {
                    bubbles: true,
                    cancelable: true,
                })
                : anyEvent;
        return domNode.dispatchEvent(objEventToDispatch);
    }

    /**
     * Dispatch a custom event on a DOM node
     * @param  {String} strName     The custom event name
     * @param  {Node}   domNode     The target DOM node
     * @param  {any}    anyDetail   Optional detail payload for the event
     * @return {Boolean}            True if the event was not canceled
     */
    function triggerCustom(strName, domNode, anyDetail = {}) {
        const objEvent = new CustomEvent(strName, {
            bubbles: true,
            cancelable: true,
            detail: anyDetail
        });
        return trigger(objEvent, domNode);
    }

    /**
     * Trigger a native method on a DOM node (e.g., .click(), .focus())
     * @param  {String} strName  The method name to trigger
     * @param  {Node}   domNode  The DOM node to act on
     */
    function triggerDefaultBehavior(strName, domNode) {
        if (typeof domNode?.[strName] === 'function') {
            domNode[strName]();
        }
    }

    /**
     * Get a copy of all currently active delegated event listeners
     * @return {Object} An object containing event types and their associated listener arrays
     */
    function get() {
        const objReturnValue = {};
        for (const strEventType in arrDelegatedEventsByType) {
            if (arrDelegatedEventsByType.hasOwnProperty(strEventType) === true) {
                objReturnValue[strEventType] = [...arrDelegatedEventsByType[strEventType]];
            }
        }
        return objReturnValue;
    }

    return {on, off, once, trigger, triggerCustom, triggerDefaultBehavior, get};
})();

export {Events};
