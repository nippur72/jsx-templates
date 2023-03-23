
/**
 * List of supported events as of React 0.14.5
 *
 */

let eventConversion: {[key:string]: string} = {};

[
   "onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted onEnded onError onLoadedData ",
   "onLoadedMetadata onLoadStart onPause onPlay onPlaying onProgress onRateChange onSeeked onSeeking ",
   "onStalled onSuspend onTimeUpdate onVolumeChange onWaiting onChange onInput onSubmit onClick ",
   "onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit onCompositionEnd onCompositionStart ",
   "onCompositionUpdate onCopy onCut onPaste onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter ",
   "onMouseLeave onFocus onBlur onKeyDown onKeyPress onKeyUp onLoad onError onMouseMove onMouseOut onMouseOver onMouseUp ",
   "onScroll onSelect onTouchCancel onTouchEnd onTouchMove onTouchStart onWheel "
].join('').split(' ').forEach(e => eventConversion[e.toLowerCase()]=e);


var ver0_12_0 = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', 'circle', 'defs', 'ellipse', 'g', 'line', 'linearGradient', 'mask', 'path', 'pattern', 'polygon', 'polyline', 'radialGradient', 'rect', 'stop', 'svg', 'text', 'tspan'];

let nativeHtmlTags: { [key:string]: boolean } = {};

ver0_12_0.forEach(e => nativeHtmlTags[e]=true);

export { eventConversion, nativeHtmlTags };
