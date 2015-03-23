; (function ($, window, document, undefined) {
	'use strict';

	/*
	node {
		childNodes: [],
		classNames: '',
		collapsed: true,
		content: '',
		title: ''
	}
	*/

	// Data API (conventional bingdings).
	// Add an icon (maybe in a disabled state) for leaf nodes.
	// Set maximum number of child nodes for each node and maintain using data attributes.
	// Encode when formatting strings with custom values (e.g. class names)?
	// (option) Scroll to the first child new node (it the parent is expanded).
	// (ie7) Change the cursor when hovering over the add/remove buttons.

	// Full keyboard a11y.
	// Full ARIA.
	// Ensure all layout is done with CSS best practices, that it support significant design layout and style changes without falling apart, including extensive font scaling.
	// (option) Wrap text if longer than will fit horizontally, ensuring it wraps to where the text is, not where the far-left edge, nor the tree line, nor the parent edge, nor the expand/collapse button, nor the node icons.
	// (option) Don't wrap text if longer than will fit horizontally; make tree wider.
	// (option) Don't wrap text if longer than will fit horizontally; abbreviate text and providing tooltip for expansion.
	// Node icons.
	// Node counts in the 1,000 - 10,000+ range which won't fit performantly in the DOM all at once in supported browsers (IE6, for example) - potentially something like virtual rendering such as datagrids do.
	// Dynamic addition of individual nodes, groups of nodes and trees of nodes, potentially with incremental rendering (for performance).
	// Relationship between data (model) and dom rendering (view) and whether changes are bi-directional.
	// Whether a tree can be created without a complex data model.
	// Whether templates can be used for the tree, for parent nodes, for children nodes, for children containers.
	// Allowing for content other than text, such as images and HTML and hyperlinks.
	// Drawing tree lines between all the nodes.
	// Selection of nodes with checkboxes.
	// Tri-state checkbox to represent a parent node with mixed-checked children (some checked, some not).
	// Check-all/uncheck-all.
	// Drag and drop to reorder nodes within the same parent.
	// Drag and drop to reorder within hierarchy, including (potentially).
	// - Changing parent.
	// - Placing after last child as sibling.
	// - Placing after last child as uncle (sibling of parent).
	// - Placing on parent to add as child.
	// - Prevent moving to specific nodes dynamically, including changing hover icon to indicate which actions are allowed and not.
	// - Drag-hover-hold over parent to expand/collapse.
	// - Drag-hover-hold over child (not yet parent) to make parent and place below as child .
	// Drag and drop multiple selection of sibling nodes to reorder within the same parent.
	// Drag and drop multiple selection of sibling nodes to reorder within hierarchy (see above indented list.
	// Drag and drop multiple trees of multiple non-contiguous selected non-sibling nodes to reorder within hierarchy (see above indented list).

	$.widget("microboot.tree", {
		_create: function () {
			var that = this;

			if (!that.element.is('ul')) {
				return;
			}

			that.element.on('click.toggle', String.format('.{0}', that.options.classNames.toggle), function (e) {
				e.preventDefault();

				var $node = $(this).parents(String.format('.{0}:first', that.options.classNames.node));

				that.toggle($node)
					.active($node);
			})
				.on('click.toggle', String.format('.{0}', that.options.classNames.content), function (e) {
					e.preventDefault();

					var $node = $(this).parents(String.format('.{0}:first', that.options.classNames.node));

					that.toggle($node)
						.active($node);
				});

			that.element.add(that.element.find('ul:last-child')).each(function () {
				var $children = $(this);

				if (!$children.parents(String.format('.{0}', that.options.classNames.content)).length) {
					if (!$children.is(that.element)) {
						$children.addClass(that.options.classNames.children);
					}

					$children.children('li')
						.addClass(that.options.classNames.node);
				}
			});

			that.element.addClass(that.options.classNames.tree);

			that.element.find(String.format('.{0}', that.options.classNames.node))
				.each(function () {
					var $node = $(this);
					var $children = $node.children('ul:last');
					$children.addClass(that.options.classNames.children);

					var $content = $node.children(String.format('.{0}', that.options.classNames.content));

					if ($content.length) {
						// Move EVERYTHING (except the children) into the content <div>.
						$content.append($node.children(String.format(':not(.{0}, .{1}, .{2})', that.options.classNames.toggle, that.options.classNames.content, that.options.classNames.children)));
					}
					else {
						// Wrap EVERYTHING (except the children) in a new content <div>.
						$content = $(String.format('<div class="{0}" />', that.options.classNames.content))
							.text($node.text2())
							.append($node.children(String.format(':not(.{0})', that.options.classNames.children)));

						$node.html($content)
							.append($children);
					}

					if ($children.length && $children.children().length) {
						if (!$node.children(String.format('.{0}:first', that.options.classNames.toggle)).length) {
							// Add the toggle icon.
							$node.prepend(that._toggleLink(that.options.collapsed));
						}
					}
					else {
						$node.addClass(that.options.classNames.leaf);
					}
				});

			that._trigger('add', null, { childNodes: that.element.children('li'), parentNode: that.element });

			if (that.options.nodes) {
				that.add(that.options.nodes, that.element);
			}

			if (that.options.collapsed) {
				that.collapseAll();
			}

			$.microboot.tree.instances.push(that.element);
		},
		_destroy: function () {
			var that = this;

			// Disable the click (toggle) event for the node text.
			that.element.off('click.toggle', String.format('.{0}', that.options.classNames.content));

			that.element.removeClass(that.options.classNames.tree);

			// Remove all of the toggle buttons.
			that.element.find(String.format('.{0}', that.options.classNames.toggle))
				.remove();

			// Remove the leaf class name.
			that.element.find(String.format('.{0}', that.options.classNames.node))
				.removeClass(String.format('{0} {1}', that.options.classNames.node, that.options.classNames.leaf));

			that.element.find(String.format('.{0}', that.options.classNames.content)).each(function () {
				var $content = $(this);

				if ($content.attr('class').split(' ').length === 1) {
					$content.parent()
						.prepend($content.html());
					$content.remove();
				}
				else {
					$content.removeClass(that.options.classNames.content);
				}
			});

			that.element.find(String.format('.{0}', that.options.classNames.children))
				.removeClass(String.format('{0} {1}', that.options.classNames.children, that.options.classNames.hide));

			that.resetActive();

			var position = $.inArray(that.element, $.microboot.tree.instances);

			if (position > -1) {
				$.microboot.tree.instances.splice(position, 1);
			}
		},
		_setOption: function (key, value) {
			var that = this;

			if (key === 'nodes') {
				that.add(value, that.element);
			}

			if (that._super) {
				return that._super(key, value);
			}
			else {
				return $.Widget.prototype._setOption.call(this);
			}
		},
		options: {
			classNames: {
				active: 'tree-active',
				children: 'tree-children',
				content: 'tree-content',
				hide: 'hide',
				icons: {
					collapsed: 'icon-right',
					expanded: 'icon-down'
				},
				leaf: 'tree-leaf',
				node: 'tree-node',
				tree: 'tree',
				toggle: 'tree-toggle',
				toggleIcon: 'tree-toggle-icon'
			},
			collapsed: true,
			nodes: []
		},
		active: function ($node) {
			var that = this;

			if (!$node || !$node.length && !$node.is('li')) {
				return that._activeNode;
			}

			if (that._activeNode) {
				that._activeNode
					.removeClass(that.options.classNames.active);
			}

			that._activeNode = $node.addClass(that.options.classNames.active);

			that.expand($node.parents(String.format('.{0}', that.options.classNames.node)));

			that._trigger('active', null, { node: $node });

			return that._activeNode;
		},
		add: function (nodes, parentNode) {
			var that = this;
			var $parentNode = $(parentNode);

			if (!$parentNode || !$parentNode.length) {
				$parentNode = that.element;
			}

			if (!$parentNode.is('ul') && !$parentNode.is('li') || !nodes) {
				return that;
			}

			var $nodes = $(that._childNodesHtml(nodes));

			if ($parentNode.is('ul')) {
				$parentNode.append($nodes);
			}
			else if ($parentNode.is('li')) {
				$parentNode.removeClass(that.options.classNames.leaf);

				if (!$parentNode.children(String.format('.{0}:first', that.options.classNames.toggle)).length) {
					$parentNode.prepend(that._toggleLink(that.options.collapsed));
				}

				var $children = $parentNode.children(String.format('.{0}:first', that.options.classNames.children));
				var hasChildren = $children.length;

				if (!hasChildren) {
					$children = $(String.format('<ul class="{0}" />', that.options.classNames.children));
				}
				else {
					that.expand($parentNode);
				}

				$children.append($nodes);

				if (!hasChildren) {
					$parentNode.append($children);
				}
			}

			if ($nodes.length === 1) {
				that.active($nodes.first());
			}

			that._trigger('add', null, { parentNode: $parentNode, nodes: $nodes });

			return that;
		},
		_childNodeHtml: function (childNode) {
			var that = this;
			var classNames = that.options.classNames.node;

			if (childNode.classNames) {
				classNames += ' ' + childNode.classNames;
			}

			if (childNode.childNodes) {
				return String.format('<li class="{0}" title="{1}">{2}<div class="{3}">{4}</div><ul class="{5}">{6}</ul></li>', classNames, childNode.title, that._toggleLink(childNode.collapsed), that.options.classNames.content, childNode.content, childNode.collapsed ? String.format('{0} {1}', that.options.classNames.children, that.options.classNames.hide) : that.options.classNames.children, that._childNodesHtml(childNode.childNodes));
			}

			classNames += ' ' + that.options.classNames.leaf;

			return String.format('<li class="{0}" title="{1}"><div class="{2}">{3}</div></li>', classNames, childNode.title, that.options.classNames.content, childNode.content);
		},
		_childNodesHtml: function (childNodes) {
			if (!childNodes) {
				return '';
			}

			var that = this;

			if ($.isArray(childNodes)) {
				return $.map(childNodes, function (childNode) {
					return that._childNodeHtml(childNode);
				}).join('');
			}

			return that._childNodeHtml(childNodes);
		},
		collapse: function (nodes) {
			var that = this;
			var $nodes = $(nodes);

			$nodes.each(function () {
				var $node = $(this);

				if (!$node.length || !$node.is('li')) {
					return that;
				}

				var $toggleIcon = $node.children(String.format('.{0}:first', that.options.classNames.toggle))
					.children('i:first');
				var $children = $node.children(String.format('.{0}:first', that.options.classNames.children));

				var parentNode = $node[0].parentNode;
				var nextSibling = $node[0].nextSibling;

				$node.detach();
				that._collapse($toggleIcon, $children);

				parentNode.insertBefore($node[0], nextSibling);

				that._trigger('collapse', null, { node: $node });
			});

			return that;
		},
		_collapse: function ($toggleIcon, $children) {
			var that = this;

			$toggleIcon.removeClass(that.options.classNames.icons.expanded)
				.addClass(that.options.classNames.icons.collapsed);
			$children.addClass(that.options.classNames.hide);

			return that;
		},
		collapseAll: function () {
			var that = this;

			var parentNode = that.element[0].parentNode;
			var nextSibling = that.element[0].nextSibling;

			that.element.detach();
			that._collapse(that.element.find(String.format('.{0}', that.options.classNames.icons.expanded)), that.element.find(String.format('.{0}:not(.{1})', that.options.classNames.children, that.options.classNames.hide)));

			parentNode.insertBefore(that.element[0], nextSibling);

			that.resetActive();

			that._trigger('collapseall', null, { nodes: that.element.children() });

			return that;
		},
		expand: function (nodes) {
			var that = this;
			var $nodes = $(nodes);

			$nodes.each(function () {
				var $node = $(this);

				if (!$node.length || !$node.is('li')) {
					return that;
				}

				var $toggleIcon = $node.children(String.format('.{0}:first', that.options.classNames.toggle))
					.children('i:first');
				var $children = $node.children(String.format('.{0}:first', that.options.classNames.children));

				var parentNode = $node[0].parentNode;
				var nextSibling = $node[0].nextSibling;

				$node.detach();
				that._expand($toggleIcon, $children);

				parentNode.insertBefore($node[0], nextSibling);

				that._trigger('expand', null, { node: $node });
			});

			return that;
		},
		_expand: function ($toggleIcon, $children) {
			var that = this;

			$toggleIcon.removeClass(that.options.classNames.icons.collapsed)
				.addClass(that.options.classNames.icons.expanded);
			$children.removeClass(that.options.classNames.hide);

			return that;
		},
		expandAll: function () {
			var that = this;

			var parentNode = that.element[0].parentNode;
			var nextSibling = that.element[0].nextSibling;

			that.element.detach();
			that._expand(that.element.find(String.format('.{0}', that.options.classNames.icons.collapsed)), that.element.find(String.format('.{0}.{1}', that.options.classNames.children, that.options.classNames.hide)));

			parentNode.insertBefore(that.element[0], nextSibling);

			that.resetActive();

			that._trigger('expandall', null, { nodes: that.element.children() });

			return that;
		},
		remove: function (node) {
			var that = this;
			var $node = $(node);

			if (!$node || !$node.length || !$node.is('li')) {
				return that;
			}

			var $parentNode = $node.parents('li:first');
			var $siblings = $parentNode.children(String.format('.{0}:first', that.options.classNames.children));

			$node.remove();

			if ($siblings.length && !$siblings.children().length) {
				if ($parentNode.parent() !== that.$element) {
					$parentNode.addClass(that.options.classNames.leaf);
				}

				$parentNode.children(String.format('.{0}:first', that.options.classNames.toggle))
					.remove();
				$siblings.remove();
			}

			that._trigger('remove', null, { node: $node, parentNode: $parentNode });

			return that;
		},
		resetActive: function () {
			var that = this;

			var $activeNode = that._activeNode;

			if ($activeNode && $activeNode.length) {
				$activeNode.removeClass(that.options.classNames.active);
			}

			that._activeNode = undefined;

			return that;
		},
		toggle: function (nodes) {
			var that = this;
			var $nodes = $(nodes);

			$nodes.each(function () {
				var $node = $(this);

				if (!$node.length || !$node.is('li')) {
					return that;
				}

				// Think of a way to remove this conditional statement.
				if (!$node.hasClass(String.format('.{0}', that.options.classNames.leaf))) {
					var $toggleIcon = $node.children(String.format('.{0}:first', that.options.classNames.toggle))
						.children('i:first');
					var $children = $node.children(String.format('.{0}:first', that.options.classNames.children));

					if ($children.children().length) {
						var parentNode = $node[0].parentNode;
						var nextSibling = $node[0].nextSibling;

						$node.detach();

						if ($children.hasClass(that.options.classNames.hide)) {
							that._expand($toggleIcon, $children);

							that._trigger('expand', null, { node: $node });
						} else {
							that._collapse($toggleIcon, $children);

							that._trigger('collapse', null, { node: $node });
						}

						parentNode.insertBefore($node[0], nextSibling);
					}
				}
			});

			return that;
		},
		_toggleLink: function (collapsed) {
			var that = this;

			return String.format('<a class="{0}" href="#"><i class="{1}"></i></a>', that.options.classNames.toggle, that.options.classNames.toggleIcon + ' ' + (collapsed ? that.options.classNames.icons.collapsed : that.options.classNames.icons.expanded));
		}
	});

	$.extend($.microboot.tree, {
		instances: []
	});
})(window.jQuery, window, document);