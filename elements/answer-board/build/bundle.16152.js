!function(e){function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var t={};n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(n){return e[n]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="/",n(n.s="mdyV")}({MV5A:function(){},QRet:function(e,n,t){"use strict";function r(e,n){y.options.__h&&y.options.__h(d,e,v||n),v=0;var t=d.__H||(d.__H={__:[],__h:[]});return e>=t.__.length&&t.__.push({}),t.__[e]}function o(e){return v=1,function(e,n,t){var o=r(p++,2);return o.t=e,o.__c||(o.__=[t?t(n):s(void 0,n),function(e){var n=o.t(o.__[0],e);o.__[0]!==n&&(o.__=[n,o.__[1]],o.__c.setState({}))}],o.__c=d),o.__}(s,e)}function i(e,n){var t=r(p++,3);!y.options.__s&&f(t.__H,n)&&(t.__=e,t.__H=n,d.__H.__h.push(t))}function _(e,n){var t=r(p++,7);return f(t.__H,n)&&(t.__=e(),t.__H=n,t.__h=e),t.__}function u(e,n){return v=8,_((function(){return e}),n)}function l(){for(var e;e=m.shift();)if(e.__P)try{e.__H.__h.forEach(c),e.__H.__h.forEach(a),e.__H.__h=[]}catch(n){e.__H.__h=[],y.options.__e(n,e.__v)}}function c(e){var n=d,t=e.__c;"function"==typeof t&&(e.__c=void 0,t()),d=n}function a(e){var n=d;e.__c=e.__(),d=n}function f(e,n){return!e||e.length!==n.length||n.some((function(n,t){return n!==e[t]}))}function s(e,n){return"function"==typeof n?n(e):n}t.d(n,"c",(function(){return o})),t.d(n,"b",(function(){return i})),t.d(n,"a",(function(){return u}));var p,d,h,y=t("hosL"),v=0,m=[],b=y.options.__b,g=y.options.__r,w=y.options.diffed,k=y.options.__c,A=y.options.unmount;y.options.__b=function(e){d=null,b&&b(e)},y.options.__r=function(e){g&&g(e),p=0;var n=(d=e.__c).__H;n&&(n.__h.forEach(c),n.__h.forEach(a),n.__h=[])},y.options.diffed=function(e){w&&w(e);var n=e.__c;n&&n.__H&&n.__H.__h.length&&(1!==m.push(n)&&h===y.options.requestAnimationFrame||((h=y.options.requestAnimationFrame)||function(e){var n,t=function(){clearTimeout(r),x&&cancelAnimationFrame(n),setTimeout(e)},r=setTimeout(t,100);x&&(n=requestAnimationFrame(t))})(l)),d=null},y.options.__c=function(e,n){n.some((function(e){try{e.__h.forEach(c),e.__h=e.__h.filter((function(e){return!e.__||a(e)}))}catch(t){n.some((function(e){e.__h&&(e.__h=[])})),n=[],y.options.__e(t,e.__v)}})),k&&k(e,n)},y.options.unmount=function(e){A&&A(e);var n,t=e.__c;t&&t.__H&&(t.__H.__.forEach((function(e){try{c(e)}catch(e){n=e}})),n&&y.options.__e(n,t.__v))};var x="function"==typeof requestAnimationFrame},QfWi:function(e,n,t){"use strict";t.r(n),function(e){function r(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?r(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):r(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function _(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null==t)return;var r,o,i=[],_=!0,u=!1;try{for(t=t.call(e);!(_=(r=t.next()).done)&&(i.push(r.value),!n||i.length!==n);_=!0);}catch(e){u=!0,o=e}finally{try{_||null==t.return||t.return()}finally{if(u)throw o}}return i}(e,n)||function(e,n){if(!e)return;if("string"==typeof e)return u(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);"Object"===t&&e.constructor&&(t=e.constructor.name);if("Map"===t||"Set"===t)return Array.from(e);if("Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return u(e,n)}(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function u(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}function l(){return e("div",null,e(h,null))}t.d(n,"default",(function(){return l}));t("MV5A");var c=t("QRet"),a="answers",f={question:"What is your favorite color?",maxAnswersPerParticipant:1,blurAnswersUntilParticipantAnswers:!1},s=function(e){for(var n,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=3735928559^t,o=1103547991^t,i=0;i<e.length;i++)n=e.charCodeAt(i),r=Math.imul(r^n,2654435761),o=Math.imul(o^n,1597334677);return r=Math.imul(r^r>>>16,2246822507)^Math.imul(o^o>>>13,3266489909),4294967296*(2097151&(o=Math.imul(o^o>>>16,2246822507)^Math.imul(r^r>>>13,3266489909)))+(r>>>0)},p=["#fdd43c","#f7901e","#fe00ec","#e93e44","#36f75a","#22ebcb","#5905f8"],d={question:{padding:20,margin:0,borderBottom:"1px black solid"},answers:{display:"flex",flexWrap:"wrap",padding:0,margin:0},answer:{backgroundColor:"#94B300",width:140,height:140,padding:5,margin:10,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",fontSize:20,textAlign:"center",border:"solid 1px black"},delete:{position:"absolute",top:0,right:0,margin:5,fontWeight:"bold"},yourAnswerContainer:{marginTop:10,padding:10},yourAnswerTextbox:{padding:10,fontSize:16},yourAnswerButton:{padding:10,marginLeft:10,fontSize:16}},h=function(){var n,t,r,i,u,l=_(Object(c.c)(""),2),h=l[0],y=l[1],v=_(Object(c.c)(!1),2),m=v[0],b=v[1],g=(u=_(Object(c.c)(0),2)[1],Object(c.a)((function(){u((function(e){return e+1}))}),[]));if(Object(c.b)((function(){fresco&&fresco.onReady((function(){b(!0),fresco.onStateChanged((function(){g()})),fresco.initialize(f,{title:"Answer Board",autoAdjustHeight:!0,toolbarButtons:[{title:"Question",ui:{type:"string"},property:"question"},{title:"Max answers per participant",ui:{type:"number"},property:"maxAnswersPerParticipant"},{title:"Blur answers until participant answers?",ui:{type:"checkbox"},property:"blurAnswersUntilParticipantAnswers"}]})}))}),[]),!m)return e("h1",null,"Initialising...");var w=(null===(n=fresco.element)||void 0===n?void 0:n.storage.answers)||[],k=w.filter((function(e){return e.ownerId===fresco.element.ownerId})).length,A=k<fresco.element.state.maxAnswersPerParticipant,x=!(k>0)&&fresco.element.state.blurAnswersUntilParticipantAnswers?o(o({},d.answer),{},{color:"transparent","text-shadow":"0 0 8px #000"}):d.answer;return e("div",null,e("h1",{style:d.question},null===(t=fresco)||void 0===t||null===(r=t.element)||void 0===r||null===(i=r.state)||void 0===i?void 0:i.question),A&&e("div",{style:d.yourAnswerContainer},e("form",null,e("input",{style:d.yourAnswerTextbox,type:"text",name:"comment",placeholder:"Add your answer",value:h,maxLength:50,onChange:function(e){return y(e.target.value)}}),e("button",{style:d.yourAnswerButton,onClick:function(e){var n=h.trim();n&&(fresco.storage.add(a,n),y("")),e.preventDefault()}},"Add answer"))),w.length?e("ul",{style:d.answers},w.map((function(n){return e("li",{key:n.id,style:o(o({},x),{},{backgroundColor:p[s(n.ownerId)%p.length]})},n.value," ",n.ownerId===fresco.element.ownerId&&e("button",{onClick:function(e){return function(e,n){e.preventDefault(),fresco.storage.remove(a,n)}(e,n.id)},style:d.delete},"X"))}))):e("p",null,"No answers yet, add your own!"))}}.call(this,t("hosL").h)},hosL:function(e,n,t){"use strict";function r(e,n){for(var t in n)e[t]=n[t];return e}function o(e){var n=e.parentNode;n&&n.removeChild(e)}function i(e,n,t){var r,o,i,u={};for(i in n)"key"==i?r=n[i]:"ref"==i?o=n[i]:u[i]=n[i];if(arguments.length>2&&(u.children=arguments.length>3?H.call(arguments,2):t),"function"==typeof e&&null!=e.defaultProps)for(i in e.defaultProps)void 0===u[i]&&(u[i]=e.defaultProps[i]);return _(e,u,r,o,null)}function _(e,n,t,r,o){var i={type:e,props:n,key:t,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==o?++D:o};return null==o&&null!=M.vnode&&M.vnode(i),i}function u(){return{current:null}}function l(e){return e.children}function c(e,n){this.props=e,this.context=n}function a(e,n){if(null==n)return e.__?a(e.__,e.__.__k.indexOf(e)+1):null;for(var t;n<e.__k.length;n++)if(null!=(t=e.__k[n])&&null!=t.__e)return t.__e;return"function"==typeof e.type?a(e):null}function f(e){var n,t;if(null!=(e=e.__)&&null!=e.__c){for(e.__e=e.__c.base=null,n=0;n<e.__k.length;n++)if(null!=(t=e.__k[n])&&null!=t.__e){e.__e=e.__c.base=t.__e;break}return f(e)}}function s(e){(!e.__d&&(e.__d=!0)&&I.push(e)&&!p.__r++||W!==M.debounceRendering)&&((W=M.debounceRendering)||L)(p)}function p(){for(var e;p.__r=I.length;)e=I.sort((function(e,n){return e.__v.__b-n.__v.__b})),I=[],e.some((function(e){var n,t,o,i,_,u;e.__d&&(_=(i=(n=e).__v).__e,(u=n.__P)&&(t=[],(o=r({},i)).__v=i.__v+1,k(u,i,o,n.__n,void 0!==u.ownerSVGElement,null!=i.__h?[_]:null,t,null==_?a(i):_,i.__h),A(t,i),i.__e!=_&&f(i)))}))}function d(e,n,t,r,o,i,u,c,f,s){var p,d,y,m,b,g,w,A=r&&r.__k||R,x=A.length;for(t.__k=[],p=0;p<n.length;p++)if(null!=(m=t.__k[p]=null==(m=n[p])||"boolean"==typeof m?null:"string"==typeof m||"number"==typeof m||"bigint"==typeof m?_(null,m,null,null,m):Array.isArray(m)?_(l,{children:m},null,null,null):m.__b>0?_(m.type,m.props,m.key,null,m.__v):m)){if(m.__=t,m.__b=t.__b+1,null===(y=A[p])||y&&m.key==y.key&&m.type===y.type)A[p]=void 0;else for(d=0;d<x;d++){if((y=A[d])&&m.key==y.key&&m.type===y.type){A[d]=void 0;break}y=null}k(e,m,y=y||N,o,i,u,c,f,s),b=m.__e,(d=m.ref)&&y.ref!=d&&(w||(w=[]),y.ref&&w.push(y.ref,null,m),w.push(d,m.__c||b,m)),null!=b?(null==g&&(g=b),"function"==typeof m.type&&m.__k===y.__k?m.__d=f=h(m,f,e):f=v(e,m,y,A,b,f),"function"==typeof t.type&&(t.__d=f)):f&&y.__e==f&&f.parentNode!=e&&(f=a(y))}for(t.__e=g,p=x;p--;)null!=A[p]&&("function"==typeof t.type&&null!=A[p].__e&&A[p].__e==t.__d&&(t.__d=a(r,p+1)),C(A[p],A[p]));if(w)for(p=0;p<w.length;p++)P(w[p],w[++p],w[++p])}function h(e,n,t){for(var r,o=e.__k,i=0;o&&i<o.length;i++)(r=o[i])&&(r.__=e,n="function"==typeof r.type?h(r,n,t):v(t,r,r,o,r.__e,n));return n}function y(e,n){return n=n||[],null==e||"boolean"==typeof e||(Array.isArray(e)?e.some((function(e){y(e,n)})):n.push(e)),n}function v(e,n,t,r,o,i){var _,u,l;if(void 0!==n.__d)_=n.__d,n.__d=void 0;else if(null==t||o!=i||null==o.parentNode)e:if(null==i||i.parentNode!==e)e.appendChild(o),_=null;else{for(u=i,l=0;(u=u.nextSibling)&&l<r.length;l+=2)if(u==o)break e;e.insertBefore(o,i),_=i}return void 0!==_?_:o.nextSibling}function m(e,n,t){"-"===n[0]?e.setProperty(n,t):e[n]=null==t?"":"number"!=typeof t||B.test(n)?t:t+"px"}function b(e,n,t,r,o){var i;e:if("style"===n)if("string"==typeof t)e.style.cssText=t;else{if("string"==typeof r&&(e.style.cssText=r=""),r)for(n in r)t&&n in t||m(e.style,n,"");if(t)for(n in t)r&&t[n]===r[n]||m(e.style,n,t[n])}else if("o"===n[0]&&"n"===n[1])i=n!==(n=n.replace(/Capture$/,"")),n=n.toLowerCase()in e?n.toLowerCase().slice(2):n.slice(2),e.l||(e.l={}),e.l[n+i]=t,t?r||e.addEventListener(n,i?w:g,i):e.removeEventListener(n,i?w:g,i);else if("dangerouslySetInnerHTML"!==n){if(o)n=n.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==n&&"list"!==n&&"form"!==n&&"tabIndex"!==n&&"download"!==n&&n in e)try{e[n]=null==t?"":t;break e}catch(e){}"function"==typeof t||(null!=t&&(!1!==t||"a"===n[0]&&"r"===n[1])?e.setAttribute(n,t):e.removeAttribute(n))}}function g(e){this.l[e.type+!1](M.event?M.event(e):e)}function w(e){this.l[e.type+!0](M.event?M.event(e):e)}function k(e,n,t,o,i,_,u,a,f){var s,p,h,y,v,m,b,g,w,k,A,P=n.type;if(void 0!==n.constructor)return null;null!=t.__h&&(f=t.__h,a=n.__e=t.__e,n.__h=null,_=[a]),(s=M.__b)&&s(n);try{e:if("function"==typeof P){if(g=n.props,w=(s=P.contextType)&&o[s.__c],k=s?w?w.props.value:s.__:o,t.__c?b=(p=n.__c=t.__c).__=p.__E:("prototype"in P&&P.prototype.render?n.__c=p=new P(g,k):(n.__c=p=new c(g,k),p.constructor=P,p.render=O),w&&w.sub(p),p.props=g,p.state||(p.state={}),p.context=k,p.__n=o,h=p.__d=!0,p.__h=[]),null==p.__s&&(p.__s=p.state),null!=P.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=r({},p.__s)),r(p.__s,P.getDerivedStateFromProps(g,p.__s))),y=p.props,v=p.state,h)null==P.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(null==P.getDerivedStateFromProps&&g!==y&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(g,k),!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(g,p.__s,k)||n.__v===t.__v){p.props=g,p.state=p.__s,n.__v!==t.__v&&(p.__d=!1),p.__v=n,n.__e=t.__e,n.__k=t.__k,n.__k.forEach((function(e){e&&(e.__=n)})),p.__h.length&&u.push(p);break e}null!=p.componentWillUpdate&&p.componentWillUpdate(g,p.__s,k),null!=p.componentDidUpdate&&p.__h.push((function(){p.componentDidUpdate(y,v,m)}))}p.context=k,p.props=g,p.state=p.__s,(s=M.__r)&&s(n),p.__d=!1,p.__v=n,p.__P=e,s=p.render(p.props,p.state,p.context),p.state=p.__s,null!=p.getChildContext&&(o=r(r({},o),p.getChildContext())),h||null==p.getSnapshotBeforeUpdate||(m=p.getSnapshotBeforeUpdate(y,v)),A=null!=s&&s.type===l&&null==s.key?s.props.children:s,d(e,Array.isArray(A)?A:[A],n,t,o,i,_,u,a,f),p.base=n.__e,n.__h=null,p.__h.length&&u.push(p),b&&(p.__E=p.__=null),p.__e=!1}else null==_&&n.__v===t.__v?(n.__k=t.__k,n.__e=t.__e):n.__e=x(t.__e,n,t,o,i,_,u,f);(s=M.diffed)&&s(n)}catch(e){n.__v=null,(f||null!=_)&&(n.__e=a,n.__h=!!f,_[_.indexOf(a)]=null),M.__e(e,n,t)}}function A(e,n){M.__c&&M.__c(n,e),e.some((function(n){try{e=n.__h,n.__h=[],e.some((function(e){e.call(n)}))}catch(e){M.__e(e,n.__v)}}))}function x(e,n,t,r,i,_,u,l){var c,f,s,p=t.props,h=n.props,y=n.type,v=0;if("svg"===y&&(i=!0),null!=_)for(;v<_.length;v++)if((c=_[v])&&"setAttribute"in c==!!y&&(y?c.localName===y:3===c.nodeType)){e=c,_[v]=null;break}if(null==e){if(null===y)return document.createTextNode(h);e=i?document.createElementNS("http://www.w3.org/2000/svg",y):document.createElement(y,h.is&&h),_=null,l=!1}if(null===y)p===h||l&&e.data===h||(e.data=h);else{if(_=_&&H.call(e.childNodes),f=(p=t.props||N).dangerouslySetInnerHTML,s=h.dangerouslySetInnerHTML,!l){if(null!=_)for(p={},v=0;v<e.attributes.length;v++)p[e.attributes[v].name]=e.attributes[v].value;(s||f)&&(s&&(f&&s.__html==f.__html||s.__html===e.innerHTML)||(e.innerHTML=s&&s.__html||""))}if(function(e,n,t,r,o){var i;for(i in t)"children"===i||"key"===i||i in n||b(e,i,null,t[i],r);for(i in n)o&&"function"!=typeof n[i]||"children"===i||"key"===i||"value"===i||"checked"===i||t[i]===n[i]||b(e,i,n[i],t[i],r)}(e,h,p,i,l),s)n.__k=[];else if(v=n.props.children,d(e,Array.isArray(v)?v:[v],n,t,r,i&&"foreignObject"!==y,_,u,_?_[0]:t.__k&&a(t,0),l),null!=_)for(v=_.length;v--;)null!=_[v]&&o(_[v]);l||("value"in h&&void 0!==(v=h.value)&&(v!==e.value||"progress"===y&&!v||"option"===y&&v!==p.value)&&b(e,"value",v,p.value,!1),"checked"in h&&void 0!==(v=h.checked)&&v!==e.checked&&b(e,"checked",v,p.checked,!1))}return e}function P(e,n,t){try{"function"==typeof e?e(n):e.current=n}catch(e){M.__e(e,t)}}function C(e,n,t){var r,i;if(M.unmount&&M.unmount(e),(r=e.ref)&&(r.current&&r.current!==e.__e||P(r,null,n)),null!=(r=e.__c)){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(e){M.__e(e,n)}r.base=r.__P=null}if(r=e.__k)for(i=0;i<r.length;i++)r[i]&&C(r[i],n,"function"!=typeof e.type);t||null==e.__e||o(e.__e),e.__e=e.__d=void 0}function O(e,n,t){return this.constructor(e,t)}function S(e,n,t){var r,o,_;M.__&&M.__(e,n),o=(r="function"==typeof t)?null:t&&t.__k||n.__k,_=[],k(n,e=(!r&&t||n).__k=i(l,null,[e]),o||N,N,void 0!==n.ownerSVGElement,!r&&t?[t]:o?null:n.firstChild?H.call(n.childNodes):null,_,!r&&t?t:o?o.__e:n.firstChild,r),A(_,e)}function j(e,n){S(e,n,j)}function E(e,n,t){var o,i,u,l=r({},e.props);for(u in n)"key"==u?o=n[u]:"ref"==u?i=n[u]:l[u]=n[u];return arguments.length>2&&(l.children=arguments.length>3?H.call(arguments,2):t),_(e.type,l,o||e.key,i||e.ref,null)}function T(e,n){var t={__c:n="__cC"+F++,__:e,Consumer:function(e,n){return e.children(n)},Provider:function(e){var t,r;return this.getChildContext||(t=[],(r={})[n]=this,this.getChildContext=function(){return r},this.shouldComponentUpdate=function(e){this.props.value!==e.value&&t.some(s)},this.sub=function(e){t.push(e);var n=e.componentWillUnmount;e.componentWillUnmount=function(){t.splice(t.indexOf(e),1),n&&n.call(e)}}),e.children}};return t.Provider.__=t.Consumer.contextType=t}t.r(n),t.d(n,"render",(function(){return S})),t.d(n,"hydrate",(function(){return j})),t.d(n,"createElement",(function(){return i})),t.d(n,"h",(function(){return i})),t.d(n,"Fragment",(function(){return l})),t.d(n,"createRef",(function(){return u})),t.d(n,"isValidElement",(function(){return U})),t.d(n,"Component",(function(){return c})),t.d(n,"cloneElement",(function(){return E})),t.d(n,"createContext",(function(){return T})),t.d(n,"toChildArray",(function(){return y})),t.d(n,"options",(function(){return M}));var H,M,D,U,I,L,W,F,N={},R=[],B=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;H=R.slice,M={__e:function(e,n){for(var t,r,o;n=n.__;)if((t=n.__c)&&!t.__)try{if((r=t.constructor)&&null!=r.getDerivedStateFromError&&(t.setState(r.getDerivedStateFromError(e)),o=t.__d),null!=t.componentDidCatch&&(t.componentDidCatch(e),o=t.__d),o)return t.__E=t}catch(n){e=n}throw e}},D=0,U=function(e){return null!=e&&void 0===e.constructor},c.prototype.setState=function(e,n){var t;t=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=r({},this.state),"function"==typeof e&&(e=e(r({},t),this.props)),e&&r(t,e),null!=e&&this.__v&&(n&&this.__h.push(n),s(this))},c.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),s(this))},c.prototype.render=l,I=[],L="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,p.__r=0,F=0},mdyV:function(e,n,t){"use strict";t.r(n);var r=t("hosL"),o=r.h,i=r.render,_=function(e){return e&&e.default?e.default:e};if("function"==typeof _(t("QfWi"))){var u=document.getElementById("preact_root")||document.body.firstElementChild;0,function(){var e=_(t("QfWi")),n={},r=document.querySelector('[type="__PREACT_CLI_DATA__"]');r&&(n=JSON.parse(decodeURI(r.innerHTML)).preRenderData||n);var l;n.url&&(l=n.url);i(o(e,{CLI_DATA:{preRenderData:n}}),document.body,u)}()}}});
//# sourceMappingURL=bundle.16152.js.map