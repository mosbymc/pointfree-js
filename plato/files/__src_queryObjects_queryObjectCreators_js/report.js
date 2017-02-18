__report = {"info":{"file":"./src/queryObjects/queryObjectCreators.js","fileShort":"./src/queryObjects/queryObjectCreators.js","fileSafe":"__src_queryObjects_queryObjectCreators_js","link":"files/__src_queryObjects_queryObjectCreators_js/index.html"},"complexity":{"methodAggregate":{"cyclomatic":6,"cyclomaticDensity":5.085,"halstead":{"bugs":2.011,"difficulty":25.526,"effort":154008.57,"length":838,"time":8556.032,"vocabulary":147,"volume":6033.325,"operands":{"distinct":133,"total":485,"identifiers":["__stripped__"]},"operators":{"distinct":14,"total":353,"identifiers":["__stripped__"]}},"params":73,"sloc":{"logical":118,"physical":284}},"settings":{"commonjs":true,"forin":false,"logicalor":true,"switchcase":true,"trycatch":false,"newmi":true},"classes":[],"dependencies":[{"line":1,"path":"./queryable","type":"esm"},{"line":2,"path":"./orderedQueryable","type":"esm"},{"line":3,"path":"../projection/projectionFunctions","type":"esm"},{"line":4,"path":"../helpers","type":"esm"}],"errors":[],"lineEnd":284,"lineStart":1,"maintainability":79.62,"methods":[{"cyclomatic":3,"cyclomaticDensity":10.345,"halstead":{"bugs":0.355,"difficulty":6.386,"effort":6807.177,"length":177,"time":378.177,"vocabulary":65,"volume":1065.959,"operands":{"distinct":57,"total":91,"identifiers":["__stripped__"]},"operators":{"distinct":8,"total":86,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":29,"physical":89},"errors":[],"lineEnd":94,"lineStart":6,"name":"createNewQueryableDelegator"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.006,"difficulty":2,"effort":36.189,"length":7,"time":2.011,"vocabulary":6,"volume":18.095,"operands":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":25,"lineStart":23,"name":"_map"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.006,"difficulty":2,"effort":36.189,"length":7,"time":2.011,"vocabulary":6,"volume":18.095,"operands":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":28,"lineStart":26,"name":"_where"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.006,"difficulty":2,"effort":36.189,"length":7,"time":2.011,"vocabulary":6,"volume":18.095,"operands":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":31,"lineStart":29,"name":"_concat"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.01,"difficulty":2.1,"effort":63,"length":10,"time":3.5,"vocabulary":8,"volume":30,"operands":{"distinct":5,"total":7,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":34,"lineStart":32,"name":"_except"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.018,"difficulty":2.438,"effort":134.918,"length":16,"time":7.495,"vocabulary":11,"volume":55.351,"operands":{"distinct":8,"total":13,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":5,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":37,"lineStart":35,"name":"_groupJoin"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.01,"difficulty":2.1,"effort":63,"length":10,"time":3.5,"vocabulary":8,"volume":30,"operands":{"distinct":5,"total":7,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":40,"lineStart":38,"name":"_intersect"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.018,"difficulty":2.438,"effort":134.918,"length":16,"time":7.495,"vocabulary":11,"volume":55.351,"operands":{"distinct":8,"total":13,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":5,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":43,"lineStart":41,"name":"_join"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.01,"difficulty":2.1,"effort":63,"length":10,"time":3.5,"vocabulary":8,"volume":30,"operands":{"distinct":5,"total":7,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":46,"lineStart":44,"name":"_union"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.008,"difficulty":2.25,"effort":56.849,"length":9,"time":3.158,"vocabulary":7,"volume":25.266,"operands":{"distinct":4,"total":6,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":49,"lineStart":47,"name":"_zip"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.008,"difficulty":2.25,"effort":56.849,"length":9,"time":3.158,"vocabulary":7,"volume":25.266,"operands":{"distinct":4,"total":6,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":53,"lineStart":51,"name":"_groupBy"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.008,"difficulty":2.25,"effort":56.849,"length":9,"time":3.158,"vocabulary":7,"volume":25.266,"operands":{"distinct":4,"total":6,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":56,"lineStart":54,"name":"_groupByDescending"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.008,"difficulty":2.25,"effort":56.849,"length":9,"time":3.158,"vocabulary":7,"volume":25.266,"operands":{"distinct":4,"total":6,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":59,"lineStart":57,"name":"_orderBy"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.008,"difficulty":2.25,"effort":56.849,"length":9,"time":3.158,"vocabulary":7,"volume":25.266,"operands":{"distinct":4,"total":6,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":62,"lineStart":60,"name":"_orderByDescending"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.007,"difficulty":1.875,"effort":42.11,"length":8,"time":2.339,"vocabulary":7,"volume":22.459,"operands":{"distinct":4,"total":5,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":65,"lineStart":63,"name":"_distinct"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.004,"difficulty":1.5,"effort":17.414,"length":5,"time":0.967,"vocabulary":5,"volume":11.61,"operands":{"distinct":2,"total":2,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":0,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":68,"lineStart":66,"name":"_flatten"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.004,"difficulty":1.5,"effort":17.414,"length":5,"time":0.967,"vocabulary":5,"volume":11.61,"operands":{"distinct":2,"total":2,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":0,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":71,"lineStart":69,"name":"_flattenDeep"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.004,"difficulty":1.5,"effort":17.414,"length":5,"time":0.967,"vocabulary":5,"volume":11.61,"operands":{"distinct":2,"total":2,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":0,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":74,"lineStart":72,"name":"_getData"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.007,"difficulty":1.875,"effort":42.11,"length":8,"time":2.339,"vocabulary":7,"volume":22.459,"operands":{"distinct":4,"total":5,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":77,"lineStart":75,"name":"_take"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.006,"difficulty":2,"effort":36.189,"length":7,"time":2.011,"vocabulary":6,"volume":18.095,"operands":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":80,"lineStart":78,"name":"_takeWhile"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.007,"difficulty":1.875,"effort":42.11,"length":8,"time":2.339,"vocabulary":7,"volume":22.459,"operands":{"distinct":4,"total":5,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":83,"lineStart":81,"name":"_any"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.007,"difficulty":1.875,"effort":42.11,"length":8,"time":2.339,"vocabulary":7,"volume":22.459,"operands":{"distinct":4,"total":5,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":86,"lineStart":84,"name":"_all"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.006,"difficulty":2,"effort":36.189,"length":7,"time":2.011,"vocabulary":6,"volume":18.095,"operands":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":89,"lineStart":87,"name":"_first"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.006,"difficulty":2,"effort":36.189,"length":7,"time":2.011,"vocabulary":6,"volume":18.095,"operands":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":92,"lineStart":90,"name":"_last"},{"cyclomatic":3,"cyclomaticDensity":11.111,"halstead":{"bugs":0.325,"difficulty":6.615,"effort":6447.598,"length":165,"time":358.2,"vocabulary":60,"volume":974.637,"operands":{"distinct":52,"total":86,"identifiers":["__stripped__"]},"operators":{"distinct":8,"total":79,"identifiers":["__stripped__"]}},"params":3,"sloc":{"logical":27,"physical":88},"errors":[],"lineEnd":261,"lineStart":174,"name":"createNewOrderedQueryableDelegator"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.006,"difficulty":2,"effort":36.189,"length":7,"time":2.011,"vocabulary":6,"volume":18.095,"operands":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":184,"lineStart":182,"name":"_map"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.006,"difficulty":2,"effort":36.189,"length":7,"time":2.011,"vocabulary":6,"volume":18.095,"operands":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":187,"lineStart":185,"name":"_where"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.006,"difficulty":2,"effort":36.189,"length":7,"time":2.011,"vocabulary":6,"volume":18.095,"operands":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":190,"lineStart":188,"name":"_concat"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.018,"difficulty":2.438,"effort":134.918,"length":16,"time":7.495,"vocabulary":11,"volume":55.351,"operands":{"distinct":8,"total":13,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":5,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":193,"lineStart":191,"name":"_join"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.01,"difficulty":2.1,"effort":63,"length":10,"time":3.5,"vocabulary":8,"volume":30,"operands":{"distinct":5,"total":7,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":196,"lineStart":194,"name":"_union"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.008,"difficulty":2.25,"effort":56.849,"length":9,"time":3.158,"vocabulary":7,"volume":25.266,"operands":{"distinct":4,"total":6,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":199,"lineStart":197,"name":"_zip"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.01,"difficulty":2.1,"effort":63,"length":10,"time":3.5,"vocabulary":8,"volume":30,"operands":{"distinct":5,"total":7,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":202,"lineStart":200,"name":"_except"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.01,"difficulty":2.1,"effort":63,"length":10,"time":3.5,"vocabulary":8,"volume":30,"operands":{"distinct":5,"total":7,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":205,"lineStart":203,"name":"_intersect"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.007,"difficulty":1.875,"effort":42.11,"length":8,"time":2.339,"vocabulary":7,"volume":22.459,"operands":{"distinct":4,"total":5,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":208,"lineStart":206,"name":"_distinct"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.004,"difficulty":1.5,"effort":17.414,"length":5,"time":0.967,"vocabulary":5,"volume":11.61,"operands":{"distinct":2,"total":2,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":0,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":211,"lineStart":209,"name":"_getData"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.007,"difficulty":1.875,"effort":42.11,"length":8,"time":2.339,"vocabulary":7,"volume":22.459,"operands":{"distinct":4,"total":5,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":214,"lineStart":212,"name":"_take"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.006,"difficulty":2,"effort":36.189,"length":7,"time":2.011,"vocabulary":6,"volume":18.095,"operands":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":217,"lineStart":215,"name":"_takeWhile"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.007,"difficulty":1.875,"effort":42.11,"length":8,"time":2.339,"vocabulary":7,"volume":22.459,"operands":{"distinct":4,"total":5,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":220,"lineStart":218,"name":"_any"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.007,"difficulty":1.875,"effort":42.11,"length":8,"time":2.339,"vocabulary":7,"volume":22.459,"operands":{"distinct":4,"total":5,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":223,"lineStart":221,"name":"_all"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.006,"difficulty":2,"effort":36.189,"length":7,"time":2.011,"vocabulary":6,"volume":18.095,"operands":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":226,"lineStart":224,"name":"_first"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.006,"difficulty":2,"effort":36.189,"length":7,"time":2.011,"vocabulary":6,"volume":18.095,"operands":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":229,"lineStart":227,"name":"_last"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.008,"difficulty":2.25,"effort":56.849,"length":9,"time":3.158,"vocabulary":7,"volume":25.266,"operands":{"distinct":4,"total":6,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":244,"lineStart":242,"name":"_orderBy"},{"cyclomatic":1,"cyclomaticDensity":100,"halstead":{"bugs":0.008,"difficulty":2.25,"effort":56.849,"length":9,"time":3.158,"vocabulary":7,"volume":25.266,"operands":{"distinct":4,"total":6,"identifiers":["__stripped__"]},"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":1,"physical":3},"errors":[],"lineEnd":248,"lineStart":246,"name":"_orderByDescending"},{"cyclomatic":1,"cyclomaticDensity":20,"halstead":{"bugs":0.044,"difficulty":6.045,"effort":806.691,"length":32,"time":44.816,"vocabulary":18,"volume":133.438,"operands":{"distinct":11,"total":19,"identifiers":["__stripped__"]},"operators":{"distinct":7,"total":13,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":5,"physical":4},"errors":[],"lineEnd":253,"lineStart":250,"name":"_thenBy"},{"cyclomatic":1,"cyclomaticDensity":20,"halstead":{"bugs":0.044,"difficulty":6.045,"effort":806.691,"length":32,"time":44.816,"vocabulary":18,"volume":133.438,"operands":{"distinct":11,"total":19,"identifiers":["__stripped__"]},"operators":{"distinct":7,"total":13,"identifiers":["__stripped__"]}},"params":2,"sloc":{"logical":5,"physical":4},"errors":[],"lineEnd":258,"lineStart":255,"name":"thenByDescending"},{"cyclomatic":1,"cyclomaticDensity":50,"halstead":{"bugs":0.016,"difficulty":3.5,"effort":163.116,"length":13,"time":9.062,"vocabulary":12,"volume":46.605,"operands":{"distinct":6,"total":7,"identifiers":["__stripped__"]},"operators":{"distinct":6,"total":6,"identifiers":["__stripped__"]}},"params":1,"sloc":{"logical":2,"physical":19},"errors":[],"lineEnd":282,"lineStart":264,"name":"addGetter"},{"cyclomatic":2,"cyclomaticDensity":33.333,"halstead":{"bugs":0.037,"difficulty":7.5,"effort":828.1,"length":29,"time":46.006,"vocabulary":14,"volume":110.413,"operands":{"distinct":7,"total":15,"identifiers":["__stripped__"]},"operators":{"distinct":7,"total":14,"identifiers":["__stripped__"]}},"params":0,"sloc":{"logical":6,"physical":12},"errors":[],"lineEnd":279,"lineStart":268,"name":"_data"}],"methodAverage":{"cyclomatic":1.106,"cyclomaticDensity":90.315,"halstead":{"bugs":0.025,"difficulty":2.532,"effort":381.654,"length":16.936,"time":21.203,"vocabulary":10.043,"volume":73.53,"operands":{"distinct":6.511,"total":9.83},"operators":{"distinct":3.532,"total":7.106}},"params":1.553,"sloc":{"logical":2.447,"physical":7.213}},"module":"./src/queryObjects/queryObjectCreators.js"},"jshint":{"messages":[]}}