// This class emulates the relevant parts of ElementInternals for us
export default class ElementInternalsShim {
  constructor(element) {
    this._element = element;
    if (element.attachInternals) {
      this._internals = element.attachInternals();
    }

    this._tabIndexBeforeDisabling = '0';
  }

  handleDisabledChanged(disabled) {
    if (this._internals) {
      // No need to do anything; the browser will take care of this for us.
      return;
    }

    this._element.setAttribute('aria-disabled', disabled);

    if (disabled) {
      this._tabIndexBeforeDisabling = this._element.getAttribute('tabindex');

      // This isn't as good as really disabling it, because it doesn't prevent click-focusability.
      // But it's the best we can do.
      this._element.setAttribute('tabindex', '-1');
    } else if (this._element.getAttribute('tabindex') === '-1') {
      if (this._tabIndexBeforeDisabling !== null) {
        this._element.setAttribute('tabindex', this._tabIndexBeforeDisabling);
      } else {
        this._element.removeAttribute('tabindex');
      }
    }
  }

  setRole(role) {
    if (this._internals && 'role' in this._internals) {
      this._internals.role = role;
    } else {
      // We want to let non-default roles override.
      if (!this._element.hasAttribute('role')) {
        this._element.setAttribute('role', role);
      }
    }
  }

  setARIAChecked(value) {
    if (this._internals && 'ariaChecked' in this._internals) {
      this._internals.ariaChecked = value;
    } else {
      // Unlike role, we're not concerned with preserving overriden aria-checked values.
      this._element.setAttribute('aria-checked', value);
    }
  }

  makeFocusable() {
    // We don't know what the ElementInternals version of this will look like yet.

    if (!this._element.hasAttribute('tabindex')) {
      this._element.setAttribute('tabindex', '0');
    }
  }

  setFormValue(value) {
    // TODO
  }

  get form() {
    if (this._internals && 'form' in this._internals) {
      return this._internals.form;
    }

    // TODO
    return null;
  }
  get willValidate() {
    if (this._internals && 'willValidate' in this._internals) {
      return this._internals.willValidate;
    }

    // TODO
    return this;
  }
  get validity() {
    if (this._internals && 'validity' in this._internals) {
      return this._internals.validity;
    }

    // TODO
    return null;
  }
  get validationMessage() {
    if (this._internals && 'validationMessage' in this._internals) {
      return this._internals.validationMessage;
    }

    // TODO
    return "";
  }
  get labels() {
    if (this._internals && 'labels' in this._internals) {
      return this._internals.labels;
    }

    // TODO
    return [];
  }
  checkValidity() {
    if (this._internals && 'checkValidity' in this._internals) {
      return this._internals.checkValidity();
    }

    // TODO
  }
  reportValidity() {
    if (this._internals && 'reportValidity' in this._internals) {
      return this._internals.reportValidity();
    }

    // TODO
  }
  setCustomValidity(error) {
    if (error === undefined) {
      throw new TypeError('Too few arguments');
    }

    if (this._internals && 'setValidity' in this._internals) {
      this._internals.setValidity({customError: true}, error);
      return;
    }

    // TODO
  }
}
