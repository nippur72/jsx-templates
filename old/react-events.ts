
/**
 * List of supported events as of React 0.14.5
 *
 */

var eventList = [
   "onAbort onCanPlay onCanPlayThrough onDurationChange onEmptied onEncrypted onEnded onError onLoadedData ",
   "onLoadedMetadata onLoadStart onPause onPlay onPlaying onProgress onRateChange onSeeked onSeeking ",
   "onStalled onSuspend onTimeUpdate onVolumeChange onWaiting onChange onInput onSubmit onClick ",
   "onContextMenu onDoubleClick onDrag onDragEnd onDragEnter onDragExit onCompositionEnd onCompositionStart ",
   "onCompositionUpdate onCopy onCut onPaste onDragLeave onDragOver onDragStart onDrop onMouseDown onMouseEnter ",
   "onMouseLeave onFocus onBlur onKeyDown onKeyPress onKeyUp onLoad onError onMouseMove onMouseOut onMouseOver onMouseUp ",
   "onScroll onSelect onTouchCancel onTouchEnd onTouchMove onTouchStart onWheel "
].join('').split(' ');

export { eventList };
