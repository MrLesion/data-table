import {Events} from './events.js';

class CustomElementBase extends HTMLElement {
    static tagName = 'custom-element-base';
    static classes = {}
    static selectors = {}
    static attributes = {}
    static properties = {}
    static events = {}
    static observedAttributes = []
    static observedProperties = []
    static observedEvents = []

    static getCustomEventName(strName) {
        return this.tagName.replaceAll('-', '') + ':' + strName.toLowerCase();
    }

    // TODO: Static_initialization_blocks look into inheritance issue
    static define() {
        console.log('static define function in base: this.tagName', this.tagName)
        // console.log('static define in base: import.meta?.url', import.meta?.url)
        // console.log('static define in base: document.currentScript?.src', document.currentScript?.src)
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks
        // console.log('BASE: CustomElementBase define called with', this.tagName);
        if (customElements.get(this.tagName) === undefined) {
            customElements.define(this.tagName, this);
        }
    }

    constructor() {
        // Code that only needs to run once, ex:
        // - Set default internal state
        // - Bind this to handlers for internal events
        // - Setup static internal content
        // - Setup shadow DOM
        super();
        const objSubClass = new.target;
        this.bindEvents(objSubClass);
        this.bindProperties(objSubClass);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(`BASE: Attribute ${name} has changed. oldValue: ${oldValue} newValue: ${newValue}`);
        this.attributeHandlers[name](name, oldValue, newValue);
    }

    adoptedCallback() {
        console.log(`BASE: Custom element ${this.nodeName} moved to new page.`);
    }

    disconnectedCallback() {
        // Code that needs to be run every time the component is added/removed from the DOM, ex:
        // - Remove external and delegated event listeners
        // - Clear timeouts
        console.log(`BASE: disconnectedCallback ${this.nodeName}`);
    }

    connectedCallback() {
        // Code that needs to be run every time the component is added/removed from the DOM, ex:
        // - Add external and delegated event listeners
        // - Read attributes and childNode(s)
        // - Access parentNode(s)
        // - DOM manipulation (outside self)
        // - Network/data fetching
        console.log(`BASE: connectedCallback ${this.nodeName} ${this.tagName}`);
    }

    bindEvents(objSubClass) {
        // https://hawkticehurst.com/2023/11/you-are-probably-using-connectedcallback-wrong/
        // console.log('BASE: bindEvents called with', this);
        if (this.constructor.observedEvents !== undefined) {
            for (const strEventName of this.constructor.observedEvents) {
                // console.log('BASE: addEventListener for', strEventName, this);
                this.addEventListener(strEventName, this, true);
            }
        }
    }

    bindProperties(objSubClass) {
        // https://github.com/woutervroege/html-element-property-mixins
        // https://mayank.co/blog/custom-element-base/#attribute-reflection
        // console.log('BASE: bindProperties called with', objSubClass, this);
        // console.log('BASE: this', this.constructor.observedProperties);
        // console.log('BASE: objSubClass', objSubClass.observedProperties);

        if (objSubClass.observedProperties !== undefined) {
            for (const strPropertyName of objSubClass.observedProperties) {
                Object.defineProperty(this, strPropertyName, {
                    get() {
                        let strReturnValue = null;
                        const objPropertyHandler = this.propertyHandlers[strPropertyName];
                        if (objPropertyHandler !== undefined) {
                            strReturnValue = objPropertyHandler.get();
                            // console.log('BASE: prop getter with custom handler', strPropertyName, strReturnValue);
                        } else {
                            strReturnValue = this.getAttribute(strPropertyName);
                            // console.log('BASE: prop getter with default handler', strPropertyName, strReturnValue);
                        }
                        return strReturnValue;
                    },
                    set(value) {
                        const objPropertyHandler = this.propertyHandlers[strPropertyName];
                        if (objPropertyHandler !== undefined) {
                            objPropertyHandler.set(value);
                            // console.log('BASE: prop setter with custom handler', strPropertyName, value);
                        } else {
                            // console.log('BASE: prop setter with default handler', strPropertyName, value);
                            const strValue = String(value) ?? '';
                            this.setAttribute(strPropertyName, strValue);
                        }

                    }
                });
            }
        }
    }

    handleEvent = (objEvent) => {
        // https://webreflection.scribe.rip/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38
        // console.log('BASE: handleEvent called with event type', objEvent.type, this);
        this.eventHandlers[objEvent.type](objEvent);
    }

    triggerDefaultEventBehavior = (strName) => {
        Events.triggerDefaultBehavior(strName, this);
    }

    triggerCustomEvent(strName, anyDetail = {}, domNode = this) {
        const objEvent = new CustomEvent(strName, {
            bubbles: true,
            cancelable: true,
            composed: false,
            detail: anyDetail
        });
        return this.triggerEvent(objEvent, domNode);
    };

    triggerEvent = (strName) => {
        return Events.trigger(strName, this);
    }

    eventHandlers = {}
    attributeHandlers = {}
    propertyHandlers = {}
}

export {CustomElementBase}
