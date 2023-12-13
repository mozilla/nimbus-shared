(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"0nKP":function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/dev/data",function(){return n("uxLQ")}])},"7ljp":function(e,t,n){"use strict";n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return m}));var r=n("q1tI"),a=n.n(r);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=a.a.createContext({}),u=function(e){var t=a.a.useContext(p),n=t;return e&&(n="function"===typeof e?e(t):c(c({},t),e)),n},s=function(e){var t=u(e.components);return(a.a.createElement(p.Provider,{value:t},e.children))},f="mdxType",b={inlineCode:"code",wrapper:function(e){var t=e.children;return(a.a.createElement(a.a.Fragment,{},t))}},d=a.a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,i=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),s=u(n),f=r,d=s["".concat(i,".").concat(f)]||s[f]||b[f]||o;return n?a.a.createElement(d,c(c({ref:t},p),{},{components:n})):a.a.createElement(d,c({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"===typeof e||r){var o=n.length,i=new Array(o);i[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c[f]="string"===typeof e?e:r,i[1]=c;for(var p=2;p<o;p++)i[p]=n[p];return a.a.createElement.apply(null,i)}return a.a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},Ff2n:function(e,t,n){"use strict";function r(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}n.d(t,"a",(function(){return r}))},Qetd:function(e,t,n){"use strict";var r=Object.assign.bind(Object);e.exports=r,e.exports.default=e.exports},uxLQ:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return u}));var r=n("wx14"),a=n("Ff2n"),o=n("q1tI"),i=n.n(o),c=n("7ljp"),l=(i.a.createElement,{}),p="wrapper";function u(e){var t=e.components,n=Object(a.a)(e,["components"]);return Object(c.b)(p,Object(r.a)({},l,n,{components:t,mdxType:"MDXLayout"}),Object(c.b)("h1",null,"Adding data"),Object(c.b)("p",null,"To add data to this repository, create a file in the ",Object(c.b)("inlineCode",{parentName:"p"},"./data")," directory. The path of the file will\nbe used to place the new item in the combined data exported to packages. For example, the file\n",Object(c.b)("inlineCode",{parentName:"p"},"./data/experiment-recipe-samples/pull-factor.json")," would be available in TypeScript as\n",Object(c.b)("inlineCode",{parentName:"p"},'nimbusShared.data["experiment-recipe-samples"]["pull-factor"]'),"."),Object(c.b)("p",null,"Files can be TOML, JSON, or TypeScript. For TOML and JSON, the file is used as-is, for TypeScript\nthe default export of the file is used. Regardless of the input format, the exported data will be in\nJSON and native formats for the exported package."),Object(c.b)("p",null,"TOML and JSON files are checked against a schema that can be declared in one of two ways. The first\noption is to add a key ",Object(c.b)("inlineCode",{parentName:"p"},"__nimbusMeta.type")," to the data object, which must be the path to one of the\nschemas (ie ",Object(c.b)("inlineCode",{parentName:"p"},"experiments/NimbusExperiment"),"). This metadata will not be included in the exported\nversion of the data. Alternatively a file ",Object(c.b)("inlineCode",{parentName:"p"},"__nimbusMeta.toml")," can be added next to the file that\ncontains a TOML object with a key ",Object(c.b)("inlineCode",{parentName:"p"},"type")," with the same kind of schema path."),Object(c.b)("p",null,"Additionally, objects defined in TOML or JSON may have an automatically derived slug. If the\nmetadata of the object (as described above) includes a key ",Object(c.b)("inlineCode",{parentName:"p"},"useFilenameForSlug"),", then the name of\nthe file without the extension will be filled in as a top level key ",Object(c.b)("inlineCode",{parentName:"p"},"slug"),". This must be accepted by\nthe type of the object."))}u.isMDXComponent=!0},wx14:function(e,t,n){"use strict";function r(){return(r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e}).apply(this,arguments)}n.d(t,"a",(function(){return r}))}},[["0nKP",0,1]]]);