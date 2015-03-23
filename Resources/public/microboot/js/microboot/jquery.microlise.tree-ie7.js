// Commented it all out since it didn't work at the point I deleted it anyway



// ; (function ($, modernizr, window, document, undefined) {
//     'use strict';

//     $(function () {
//         if (modernizr) {
//             $(document).on('treecollapse', function (e, ui) {
//                 var $node = ui.node;

//                 if (!modernizr.generatedcontent) {
//                     alert('fish');
//                     $node.find('.tree-toggle-icon:first')
//                         .html(microboot.icon('icon-forward'));
//                 }
//             })
//             .on('treeexpand', function (e, ui) {
//                 var $node = ui.node;

//                 if (!modernizr.generatedcontent) {
//                     alert('fish');
//                     $node.find('.tree-toggle-icon:first')
//                         .html(microboot.icon('icon-down'));
//                 }
//             })
//             .on('treecollapseall', function (e, ui) {
//                 var $nodes = ui.nodes;

//                 if (!modernizr.generatedcontent) {
//                     alert('fish');
//                     $nodes.find('.tree-toggle-icon')
//                         .html(microboot.icon('icon-forward'));
//                 }
//             })
//             .on('treeexpandall', function (e, ui) {
//                 var $nodes = ui.nodes;

//                 if (!modernizr.generatedcontent) {
//                     alert('fish');
//                     $nodes.find('.tree-toggle-icon')
//                         .html(microboot.icon('icon-down'));
//                 }
//             });
//         }
//     });
// })(window.jQuery, window.Modernizr, window, document);