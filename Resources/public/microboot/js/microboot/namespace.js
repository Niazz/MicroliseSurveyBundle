; (function (global) {
	'use strict';

	var toString = Object.prototype.toString;

	global.namespace = function(ns, parent) {
		var parts,
			index,
			length;

		if (!ns || toString.call(ns) !== '[object String]') {
			throw new Error('Invalid namespace: ' + ns);
		}

		parts = ns.split('.');
		parent = parent || global;

		for (index = 0, length = parts.length; index < length; index += 1) {
			if (typeof parent[parts[index]] === 'undefined') {
				parent[parts[index]] = {};
			}

			parent = parent[parts[index]];
		}

		return parent;
	};
})(this);