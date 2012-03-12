module.exports = function() {

	var DIVIDER_PADDING = 10;
	var MIN_AREA = 50;

	var $area = $('.main-area');
	var $top = $('.top-panel', $area);
	var $bottom = $('.bottom-panel', $area);
	var $divider = $('.divider', $area);

	var dividerHeight = $divider.outerHeight();
	var totalHeight = $area.innerHeight();

	var dividerPoint = 0;

	// setInterval(function() {
	// 	var time = new Date();
	// 	var perc = (Math.sin(time / 1000) + 1) / 2;

	// 	setDividerPoint(perc * totalHeight);
	// }, 100);

	setDividerPoint(totalHeight / 2);

	$divider.mousedown(function() {

		var drag = function(e) {
			var y = e.pageY - $area.offset().top;

			

			setDividerPoint(y);

			return false;
		}

		$(window).mousemove(drag);

		$(window).mouseup(function() {
			$(window).unbind('mousemove', drag);

			return false;
		});

		return false;
	});

	$(window).resize(function() {
		var percent = dividerPoint / totalHeight;
		totalHeight = $area.innerHeight();
		setDividerPoint(totalHeight*percent);
	});

	function setDividerPoint(y) {
			if (y > totalHeight - MIN_AREA) {
				y = totalHeight - MIN_AREA;
			} else if (y < MIN_AREA) {
				y = MIN_AREA;
			}
			dividerPoint = y;
			$top.height(y - dividerHeight/2);
			$bottom.height(totalHeight - y - dividerHeight);
			$divider.css('top', y);
	}
		

};