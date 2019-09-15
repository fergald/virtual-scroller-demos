import * as style from './style.mjs';
import {SwitchTrack} from './track.mjs';
import ElementInternalsShim from './element-internals-shim.mjs';

const generateStyleSheet = style.styleSheetFactory();

export class StdSwitchElement extends HTMLElement {
  static get formAssociated() {
    return true;
  }
  static get observedAttributes() {
    return ['on', 'disabled'];
  }

  constructor() {
    super();
    if (new.target !== StdSwitchElement) {
      throw new TypeError(
          'Illegal constructor: StdSwitchElement is not ' +
          'extensible for now');
    }
    this._inUserAction = false;
    this._initializeDOM();

    this._internalsShim = new ElementInternalsShim(this);

    this.addEventListener('click', () => this._onClick());
    this.addEventListener('keypress', e => this._onKeyPress(e));
  }

  // TODO: make this work for the shim somehow
  formResetCallback() {
    this.on = this.defaultOn;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'on': {
        const on = newValue !== null;

        this._track.value = on;
        this._internalsShim.setFormValue(on ? 'on' : 'off');
        this._internalsShim.setARIAChecked(on ? 'true': 'false');

        if (!this._inUserAction) {
          for (const element of this._containerElement.querySelectorAll('*')) {
            style.unmarkTransition(element);
          }
        }

        break;
      }

      case 'disabled': {
        this._internalsShim.handleDisabledChanged(newValue !== null);

        break;
      }
    }
  }

  connectedCallback() {
    this._internalsShim.makeFocusable();
    this._internalsShim.setRole('switch');
  }

  _initializeDOM() {
    const factory = this.ownerDocument;
    const root = this.attachShadow({mode: 'closed'});
    this._containerElement = factory.createElement('span');
    this._containerElement.id = 'container';
    // Shadow elements should be invisible for a11y technologies.
    this._containerElement.setAttribute('aria-hidden', 'true');
    root.appendChild(this._containerElement);

    this._track = new SwitchTrack(factory);
    this._containerElement.appendChild(this._track.element);
    this._track.value = this.on;

    const thumbElement =
        this._containerElement.appendChild(factory.createElement('span'));
    thumbElement.id = 'thumb';

    if ('part' in thumbElement) {
      thumbElement.part.add('thumb');
    }

    root.append(generateStyleSheet());
  }

  _onClick() {
    // Only necessary for the polyfill; if form-associated custom elements work
    // then the event will never reach us.
    if (this.disabled) {
      return;
    }

    for (const element of this._containerElement.querySelectorAll('*')) {
      style.markTransition(element);
    }
    this._inUserAction = true;
    try {
      this.on = !this.on;
    } finally {
      this._inUserAction = false;
    }
    this.dispatchEvent(new Event('input', {bubbles: true}));
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }

  _onKeyPress(event) {
    // Only necessary for the polyfill; if form-associated custom elements work
    // then the event will never reach us.
    if (this.disabled) {
      return;
    }

    if (event.code === 'Space') {
      // Do not scroll the page.
      event.preventDefault();
      this._onClick(event);
    }
  }

  get type() {
    return 'std-switch';
  }
  get form() {
    return this._internalsShim.form;
  }
  get willValidate() {
    return this._internalsShim.willValidate;
  }
  get validity() {
    return this._internalsShim.validity;
  }
  get validationMessage() {
    return this._internalsShim.validationMessage;
  }
  get labels() {
    return this._internalsShim.labels;
  }
  checkValidity() {
    return this._internalsShim.checkValidity();
  }
  reportValidity() {
    return this._internalsShim.reportValidity();
  }
  setCustomValidity(error) {
    this._internalsShim.setCustomValidity(error);
  }

  get name() {
    const value = this.getAttribute('name');
    return value === null ? '' : value;
  }
  set name(value) {
    this.setAttribute('name', value);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }
  set disabled(value) {
    this.toggleAttribute('disabled', Boolean(value));
  }

  get on() {
    return this.hasAttribute('on');
  }
  set on(value) {
    this.toggleAttribute('on', Boolean(value));
  }

  get defaultOn() {
    return this.hasAttribute('defaulton');
  }
  set defaultOn(value) {
    this.toggleAttribute('defaulton', Boolean(value));
  }
}

Object.defineProperty(StdSwitchElement.prototype, Symbol.toStringTag, {
  configurable: true,
  enumerable: false,
  value: 'StdSwitchElement',
  writable: false,
});

Object.defineProperty(StdSwitchElement.prototype, 'on', {enumerable: true});
Object.defineProperty(StdSwitchElement.prototype, 'defaultOn', {enumerable: true});
Object.defineProperty(StdSwitchElement.prototype, 'form', {enumerable: true});
Object.defineProperty(StdSwitchElement.prototype, 'willValidate', {enumerable: true});
Object.defineProperty(StdSwitchElement.prototype, 'validity', {enumerable: true});
Object.defineProperty(StdSwitchElement.prototype, 'validationMessage', {enumerable: true});
Object.defineProperty(StdSwitchElement.prototype, 'labels', {enumerable: true});
Object.defineProperty(StdSwitchElement.prototype, 'checkValidity', {enumerable: true});
Object.defineProperty(StdSwitchElement.prototype, 'reportValidity', {enumerable: true});
Object.defineProperty(StdSwitchElement.prototype, 'setCustomValidity', {enumerable: true});

customElements.define('std-switch', StdSwitchElement);
delete StdSwitchElement.formAssociated;
delete StdSwitchElement.observedAttributes;
delete StdSwitchElement.prototype.attributeChangedCallback;
delete StdSwitchElement.prototype.connectedCallback;
delete StdSwitchElement.prototype.formResetCallback;
