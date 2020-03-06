(function($) {
	"use strict";
	$(document).ready(function() {
		/*==Left Navigation Accordion ==*/
		if ($.fn.dcAccordion) {
			$("#nav-accordion").dcAccordion({
				eventType: "click",
				autoClose: true,
				saveState: true,
				disableLink: true,
				speed: "slow",
				showCount: false,
				autoExpand: true,
				classExpand: "dcjq-current-parent",
			});
		}

		/*==Sidebar Toggle==*/

		$(".sidebar-toggle-box .fa-bars").click(function(e) {
			// $(".leftside-navigation").niceScroll({
			//     cursorcolor: "#1FB5AD",
			//     cursorborder: "0px solid #fff",
			//     cursorborderradius: "0px",
			//     cursorwidth: "3px"
			// });

			$("#sidebar").toggleClass("hide-left-bar");
			// if ($('#sidebar').hasClass('hide-left-bar')) {
			//     $(".leftside-navigation").getNiceScroll().hide();
			// }
			// $(".leftside-navigation").getNiceScroll().show();
			$("#main-content").toggleClass("merge-left");
			e.stopPropagation();
			if ($("#container").hasClass("open-right-panel")) {
				$("#container").removeClass("open-right-panel");
			}
			if ($(".right-sidebar").hasClass("open-right-bar")) {
				$(".right-sidebar").removeClass("open-right-bar");
			}

			if ($(".header").hasClass("merge-header")) {
				$(".header").removeClass("merge-header");
			}
		});
		$(".toggle-right-box .fa-bars").click(function(e) {
			$("#container").toggleClass("open-right-panel");
			$(".right-sidebar").toggleClass("open-right-bar");
			$(".header").toggleClass("merge-header");

			e.stopPropagation();
		});

		$(".header,#main-content,#sidebar").click(function() {
			if ($("#container").hasClass("open-right-panel")) {
				$("#container").removeClass("open-right-panel");
			}
			if ($(".right-sidebar").hasClass("open-right-bar")) {
				$(".right-sidebar").removeClass("open-right-bar");
			}

			if ($(".header").hasClass("merge-header")) {
				$(".header").removeClass("merge-header");
			}
		});
	});
})(jQuery);
