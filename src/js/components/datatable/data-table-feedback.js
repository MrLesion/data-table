import {CustomElementBase} from '../custom-element-base.js';
import TableConfig from './data-table-config.js';
export class DataTableFeedback extends CustomElementBase {
    static tagName = 'data-table-feedback';
    constructor() {
        super();
    }

    static observedEvents = [
        TableConfig.events.feedback
    ];
    connectedCallback() {
        this.dataTable = this.closest(TableConfig.selectors.dataTable);
        this.dataTable.addEventListener(TableConfig.events.feedback, this);

        this.type = this.getAttribute('type') ?? 'modal';
        this.mode = this.getAttribute('mode') ?? 'alert';

        this._handleConfirmClick = null;
        this._handleCancelClick = null;
        this._handleModalHidden = null;
    }

    eventHandlers = {
        [TableConfig.events.feedback]: (event) => {
            console.trace(event);
            this.show(event.detail);
        }
    }

    show(data) {
        let alert = null;
        console.log(data);
        if (this.type === data.type && (this.mode && data.mode && this.mode === data.mode)) {
            if (data.type === 'modal') {
                alert = bootstrap.Modal.getOrCreateInstance(this, {
                    toggle: false
                });

                if (data.mode === 'confirm') {
                    return new Promise((resolve, reject) => {
                        this._confirmResolve = resolve;
                        this._confirmReject = reject;

                        const confirmBtn = this.querySelector('.js-data-table-feedback-confirm-btn');
                        const cancelBtn = this.querySelector('.js-data-table-feedback-cancel-btn');

                        // Set up confirm button handler
                        if (confirmBtn) {
                            // Remove any previous handlers to avoid duplicates
                            if (this._handleConfirmClick) {
                                confirmBtn.removeEventListener('click', this._handleConfirmClick);
                            }

                            this._handleConfirmClick = () => {
                                // First hide the modal
                                alert.hide();

                                // Then call the callback if provided
                                if (data.callback && typeof data.callback === 'function') {
                                    data.callback.call(this);
                                }

                                // Finally resolve the promise
                                this._confirmResolve(true);
                            };

                            confirmBtn.addEventListener('click', this._handleConfirmClick);
                        }

                        // Set up cancel button handler
                        if (cancelBtn) {
                            // Remove any previous handlers to avoid duplicates
                            if (this._handleCancelClick) {
                                cancelBtn.removeEventListener('click', this._handleCancelClick);
                            }

                            this._handleCancelClick = () => {
                                // First hide the modal
                                alert.hide();

                                // Don't reject here - we'll handle rejection in the hidden.bs.modal event
                            };

                            cancelBtn.addEventListener('click', this._handleCancelClick);
                        }

                        // Handle modal hidden event (this happens after the modal is fully hidden)
                        if (this._handleModalHidden) {
                            this.removeEventListener('hidden.bs.modal', this._handleModalHidden);
                        }

                        this._handleModalHidden = () => {
                            // Only reject if the promise hasn't been resolved yet
                            if (!this._isResolved) {
                                this._isResolved = true;
                                this._confirmReject();
                            }

                            // Clean up event listeners
                            this.removeEventListener('hidden.bs.modal', this._handleModalHidden);

                            if (confirmBtn && this._handleConfirmClick) {
                                confirmBtn.removeEventListener('click', this._handleConfirmClick);
                            }

                            if (cancelBtn && this._handleCancelClick) {
                                cancelBtn.removeEventListener('click', this._handleCancelClick);
                            }

                            // Reset handlers
                            this._handleConfirmClick = null;
                            this._handleCancelClick = null;
                            this._handleModalHidden = null;
                        };

                        this.addEventListener('hidden.bs.modal', this._handleModalHidden);
                        this._isResolved = false;
                        alert.show();
                    });
                }
            }

            if (data.type === 'toast') {
                alert = bootstrap.Toast.getOrCreateInstance(this, {
                    toggle: false
                });
            }

            if (alert) {
                alert.show();
            }
        }
    }
}

customElements.define(DataTableFeedback.tagName, DataTableFeedback);