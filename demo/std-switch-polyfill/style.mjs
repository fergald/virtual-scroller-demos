// Style constant values.
const COLOR_ON = '#0077FF';
const TRACK_RADIUS = '13px';
const TRACK_BORDER_WIDTH = '2px';
const THUMB_HEIGHT = '22px';
const THUMB_WIDTH = '22px';
const THUMB_MARGIN_START = '2px';
const THUMB_MARGIN_END = '2px';

// Returns a function returning a HTMLLinkElement.
export function styleSheetFactory() {
  let url;
  return () => {
    if (!url) {
      url = URL.createObjectURL(new Blob([`
:host {
  block-size: 26px;
  border: none;
  box-sizing: border-box;
  display: inline-block;
  inline-size: 54px;
  user-select: none;
  vertical-align: middle;
}

#container {
  align-items: center;
  block-size: 100%;
  display: inline-flex;
  inline-size: 100%;
}

#thumb {
  background: white;
  block-size: ${THUMB_HEIGHT};
  border-radius: calc(${THUMB_HEIGHT} / 2);
  border: 1px solid black;
  box-sizing: border-box;
  display: inline-block;
  margin-inline-start: calc(-100% + ${THUMB_MARGIN_START});
  inline-size: ${THUMB_WIDTH};
}

#thumb.transitioning {
  transition: all linear 0.1s;
}

:host([on]) #thumb {
  border: 1px solid ${COLOR_ON};
  margin-inline-start: calc(0px - ${THUMB_WIDTH} - ${THUMB_MARGIN_END});
}

#track {
  block-size: 100%;
  border-radius: ${TRACK_RADIUS};
  border: ${TRACK_BORDER_WIDTH} solid #dddddd;
  box-shadow: 0 0 0 1px #f8f8f8;
  box-sizing: border-box;
  display: inline-block;
  inline-size: 100%;
  overflow: hidden;
  padding: 0px;
}

#trackFill {
  background: ${COLOR_ON};
  block-size: 100%;
  border-radius: calc(${TRACK_RADIUS}) - ${TRACK_BORDER_WIDTH});
  box-shadow: none;
  box-sizing: border-box;
  display: inline-block;
  inline-size: 0%;
  vertical-align: top;
}

#trackFill.transitioning {
  transition: all linear 0.1s;
}

:host([on]) #track {
  border: ${TRACK_BORDER_WIDTH} solid ${COLOR_ON};
}

:host(:focus) {
  outline-offset: 4px;
}

:host(:focus) #track {
  box-shadow: 0 0 0 2px #f8f8f8;
}

:host([on]:focus) #track {
  box-shadow: 0 0 0 2px #dddddd;
}

:host(:focus) #thumb {
  border: 2px solid black;
}

:host([on]:focus) #thumb {
  border: 2px solid ${COLOR_ON};
}

:host(:not(:focus-visible):focus) {
  outline: none;
}

:host(:not(:disabled):not([disabled]):hover) #thumb {
  inline-size: 26px;
}

:host([on]:not(:disabled):not([disabled]):hover) #thumb {
  margin-inline-start: calc(0px - 26px - ${THUMB_MARGIN_END});
}

:host(:active) #track {
  background: #dddddd;
}

:host([on]:active) #track {
  border: 2px solid #77bbff;
  box-shadow: 0 0 0 2px #f8f8f8;
}

:host([on]:active) #trackFill {
  background: #77bbff;
}

:host(:disabled), :host([disabled]) {
  opacity: 0.38;
}

/*
 * display:inline-block in the :host ruleset overrides 'hidden' handling
 * by the user agent.
 */
:host([hidden]) {
  display: none;
}

`], { type: 'text/css' }));
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    return link;
  };
}

export function markTransition(element) {
  element.classList.add('transitioning');
}

export function unmarkTransition(element) {
  element.classList.remove('transitioning');
}
