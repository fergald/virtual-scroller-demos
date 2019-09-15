// Copyright 2019 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

export class SwitchTrack {
  /**
   * @param {!Document} factory A factory for elements created for this track.
   */
  constructor(factory) {
    this._value = false;
    this._initializeDOM(factory);
  }

  /**
   * @return {!Element}
   */
  get element() {
    return this._trackElement;
  }

  /**
   * @param {Boolean} newValue
   */
  set value(newValue) {
    const oldValue = this._value;
    this._value = Boolean(newValue);

    const bar = this._fillElement;
    if (bar) {
      bar.style.inlineSize = this._value ? '100%' : '0%';
      if (oldValue !== this._value) {
        this._addSlot();
      }
    }
  }

  /**
   * @param {!Document} factory A factory for elements created for this track.
   */
  _initializeDOM(factory) {
    this._trackElement = factory.createElement('div');
    this._trackElement.id = 'track';
    this._fillElement = factory.createElement('span');
    this._fillElement.id = 'trackFill';
    this._trackElement.appendChild(this._fillElement);
    this._slotElement = factory.createElement('slot');
    this._addSlot();

    if ('part' in HTMLElement.prototype) {
      this._trackElement.part.add('track');
      this._fillElement.part.add('track-fill');
    }
  }

  /**
   * Add the <slot>
   *   - next to _fillElement if _value is true
   *   - as a child of _fillElement if _value is false
   * This behavior is helpful to show text in the track.
   */
  _addSlot() {
    if (this._value) {
      this._fillElement.appendChild(this._slotElement);
    } else {
      this._trackElement.appendChild(this._slotElement);
    }
  }
}
