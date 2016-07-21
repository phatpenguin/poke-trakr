/*jshint quotmark: false */
/*jshint white: false */
/*jshint trailing: false */
/*jshint newcap: false */
/*global React */
var app = app || {};

(function () {
	'use strict';

	var ESCAPE_KEY = 27;
	var ENTER_KEY = 13;

	app.Pokemon = React.createClass({
		handleOnClick: function (event) {
			var val = this.state.editText.trim();
			if (val) {
				this.props.onSave(val);
				this.setState({editText: val});
			} else {
				this.props.onDestroy();
			}
		}

		render: function () {
			return (
					<div className="pokemon">
						<input
							className="found-one"
							type="button"
							onClick={this.handleOnClick}/>
					</div>
			);
		}
	});
})();