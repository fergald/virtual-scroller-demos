function redP(textContent) {
  const p = document.createElement('p');
  p.style.color = 'red';
  p.textContent = textContent;
  return p;
}

/**
 * Checks that the features needed are present in the browser. If not,
 * it places error messages inside |element|.
 **/
class ConfirmFeatures extends HTMLElement {
  constructor() {
    super();
    if (this.displayLock === undefined) {
      this.appendChild(redP('Display Locking is not available'));
    }

    if (!customElements.get('virtual-scroller')) {
      const div = redP('virtual-scroller is not available');
      this.appendChild(div);
      customElements.whenDefined('virtual-scroller').then(() => {
        div.remove();
      });
    }
  }

  associateSwitch(switchElement) {
    const hasVirtualScroller = customElements.get('virtual-scroller');

    switchElement.disabled = !hasVirtualScroller;
    switchElement.on = hasVirtualScroller;

    customElements.whenDefined('virtual-scroller').then(() => {
      switchElement.disabled = false;
      switchElement.on = true;
    });
  }
}

customElements.define('confirm-features', ConfirmFeatures);
