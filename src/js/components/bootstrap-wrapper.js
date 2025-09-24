class BootstrapWrapper extends HTMLElement {
    static get observedAttributes() {
        return ['media', 'target', 'button-text'];
    }

    constructor() {
        super();
        this._wrapper = null;
        this._triggerButton = null;
        this._mediaQueryList = null;
        this._handleMediaChange = this._handleMediaChange.bind(this);
        this._componentId = `wrapper-${Math.random().toString(36).substr(2, 9)}`;
    }

    connectedCallback() {
        this.updateWrapper();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'media' || name === 'target' || name === 'button-text') {
            this.updateWrapper();
        }
    }

    disconnectedCallback() {
        if (this._mediaQueryList) {
            this._mediaQueryList.removeEventListener('change', this._handleMediaChange);
        }
    }

    updateWrapper() {
        const media = this.getAttribute('media');
        const target = this.getAttribute('target');
        const buttonText = this.getAttribute('button-text') || `Open ${target}`;

        if (media) {
            if (this._mediaQueryList) {
                this._mediaQueryList.removeEventListener('change', this._handleMediaChange);
            }
            this._mediaQueryList = window.matchMedia(media);
            this._mediaQueryList.addEventListener('change', this._handleMediaChange);
        }

        this.toggleWrapper(media && this._mediaQueryList.matches, target, buttonText);
    }

    _handleMediaChange(e) {
        const target = this.getAttribute('target');
        const buttonText = this.getAttribute('button-text') || `Open ${target}`;
        this.toggleWrapper(e.matches, target, buttonText);
    }

    toggleWrapper(shouldWrap, target, buttonText) {
        if (shouldWrap && !this._wrapper) {
            this.wrapChildren(target, buttonText);
        } else if (!shouldWrap && this._wrapper) {
            this.unwrapChildren();
        }
    }

    wrapChildren(target, buttonText) {
        this._wrapper = document.createElement('div');

        // Create the trigger button
        this._triggerButton = document.createElement('button');
        this._triggerButton.classList.add('btn', 'btn-primary');
        this._triggerButton.setAttribute('data-bs-toggle', target);
        this._triggerButton.setAttribute('data-bs-target', `#${this._componentId}`);
        this._triggerButton.textContent = buttonText;

        // Create the Bootstrap component
        const component = document.createElement('div');
        component.id = this._componentId;
        component.classList.add(target);

        if (target === 'modal') {
            component.setAttribute('aria-hidden', 'true');
            component.innerHTML = `
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Modal title</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <slot></slot>
            </div>
          </div>
        </div>
      `;
            new bootstrap.Modal(component);
        } else if (target === 'offcanvas') {
            component.classList.add('offcanvas-start');
            component.setAttribute('aria-labelledby', `${this._componentId}-label`);
            component.innerHTML = `
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="${this._componentId}-label">Offcanvas</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <slot></slot>
        </div>
      `;
            new bootstrap.Offcanvas(component);
        } else if (target === 'collapse') {
            component.classList.add('collapse');
            component.innerHTML = `<div class="card card-body"><slot></slot></div>`;
            new bootstrap.Collapse(component);
        }

        // Move children into the component's body
        const slot = component.querySelector('slot');
        while (this.firstChild) {
            slot.replaceWith(...this.childNodes);
        }

        // Append the trigger button and component
        this.appendChild(this._triggerButton);
        this.appendChild(component);
    }

    unwrapChildren() {
        // Move children back to the root
        const component = this.querySelector('.modal, .offcanvas, .collapse');
        const body = component.querySelector('.modal-body, .offcanvas-body, .card-body');
        while (body.firstChild) {
            this.appendChild(body.firstChild);
        }

        // Remove the trigger button and component
        this.removeChild(this._triggerButton);
        this.removeChild(component);
        this._wrapper = null;
        this._triggerButton = null;
    }
}

customElements.define('bootstrap-wrapper', BootstrapWrapper);
