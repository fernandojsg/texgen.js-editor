var textureSize = [ 256, 256 ];

TGUI = {};

TGUI.GeneratorDefinitions = {
	"XOR": {
		generator: TG.XOR,
		parameters: {}
	},
	"Rect": {
		generator: TG.Rect,
		parameters: {
			"size": {
				"type": "vec2i",
				"default": [ 32, 32 ],
			},
			"position": {
				"type": "vec2i",
				"default": [ 0, 0 ],
			},
		}
	},
	"Checkerboard": {
		generator: TG.CheckerBoard,
		parameters: {
			"size": {
				"type": "vec2i",
				"default": [ 32, 32 ],
			},
			"offset": {
				"type": "vec2i",
				"default": [ 0, 0 ],
			},
			"rowShift": {
				"type": "number",
				"default": 0,
			}
		}
	},
	"OR": {
		generator: TG.OR,
		parameters: {}
	},
	"SinX": {
		generator: TG.SinX,
		parameters: {
			"frequency": {
				"type": "number",
				"default": 1,
			},
			"offset": {
				"type": "number",
				"default": 0,
			},
		}
	},
	"SinY": {
		generator: TG.SinY,
		parameters: {
			"frequency": {
				"type": "number",
				"default": 1,
			},
			"offset": {
				"type": "number",
				"default": 0,
			},
		}
	},
	"Circle": {
		generator: TG.Circle,
		parameters: {
			"position": {
				"type": "vec2i",
				"default": [ 0, 0 ],
			},
			"radius": {
				"type": "number",
				"default": 50,
			},
			"delta": {
				"type": "number",
				"default": 1,
			},
		}
	},
	"SineDistort": {
		generator: TG.SineDistort,
		parameters: {
			"sines": {
				"type": "vec2i",
				"default": [ 4, 4 ],
			},
			"offset": {
				"type": "vec2i",
				"default": [ 0, 0 ],
			},
			"amplitude": {
				"type": "vec2i",
				"default": [ 16, 16 ],
			},
		}
	},
	"Twirl": {
		generator: TG.Twirl,
		parameters: {
			"position": {
				"type": "vec2i",
				"default": [ 128, 128 ],
			},
			"radius": {
				"type": "number",
				"default": 120,
			},
			"strength": {
				"type": "number",
				"default": 0.15,
			},
		}
	},
	"Noise": {
		generator: TG.Noise,
		parameters: {
		}
	},
	"Pixelate": {
		generator: TG.Pixelate,
		parameters: {
			"size": {
				"type": "vec2i",
				"default": [ 1, 1 ],
			},
		}
	},
	"Transform": {
		generator: TG.Transform,
		parameters: {
			"offset": {
				"type": "vec2f",
				"default": [ 0, 0 ],
			},
			"scale": {
				"type": "vec2f",
				"default": [ 1, 1 ],
			},
			"angle": {
				"type": "number",
				"default": 0,
			},
		}
	},

};

TGUI.TextureStep = function( id, type ) {
	this.type = type;
	this.id = id;
	this.params = {};

 	var definition = TGUI.GeneratorDefinitions[ type ];
 	for ( var paramId in definition.parameters ) {
		this.params[ paramId ] = definition.parameters[ paramId ][ 'default' ];
	}

	this.operation = "+";
}

var operations = [
	"=",
	"+",
	"-",
	"/",
	"&",
	"^",
	"min",
	"max"
];

TGUI.Texture = function() {
	
	this.steps = [];
	this.name = "Unknown";
	this.counter = 0;

}

/*
function nextOperation( but, id ) {
	
	var nextOp = operations[ ( operations.indexOf( texture.steps[ id ].operation ) + 1 ) % operations.length ];
	but.innerHTML = nextOp;
	texture.steps[ id ].operation = nextOp;
	
	render();
}
*/

function changeOperation( select, id ) {

	texture.steps[ id ].operation = select.value;
	render();
}

function generateOperationSelect(id, operation) {
	
	var html = '<select onchange="changeOperation(this, \''+(id)+'\')">';
	for (var i = 0; i < operations.length; i++ ) {
		if ( operation == operations[ i ] )
			html+= '<option selected="selected" value="' + operations[ i ]+ '">' + operations[ i ] + '</option>';
		else
			html+= '<option value="' + operations[ i ]+ '">' + operations[ i ] + '</option>';
	}

	html+='</select>';
	return html;


}

TGUI.Texture.prototype = {
	add: function ( type, operation ) {

		var id = this.counter++;
		var machine = new TGUI.TextureStep( id, type );
		this.steps.push( machine );

		var options = [];
		for (var i=0;i<this.steps.length;i++){
			var step = this.steps[i];
			var select = generateOperationSelect( step.id, step.operation );
			options.push( { value: step.id, html: select + ' (ID=' + step.id + ') ' + step.type +' <button style="display:none;float:right">delete</button>'} );

			//options.push( { value: step.id, html: '<button onclick="nextOperation(this, \''+(step.id)+'\')">'+step.operation+'</button> (ID=' + step.id + ') ' + step.type +' <button style="display:none;float:right">delete</button>'} );

			//options.push( { value: step.id, html: '<button onclick="nextOperation(this, \''+(step.id)+'\')">'+step.operation+'</button> (ID=' + step.id + ') ' + step.type +' <button style="display:none;float:right">delete</button>'} );
		}
		
		stepList.setOptions( options );
		stepList.setValue( id );
		generatorSelected( id );

	}
}

var texture = new TGUI.Texture();

function render() {

	var _texture = new TG.Texture( 256, 256 );

	for ( var i = 0; i < texture.steps.length; i++ ) {

		var step = texture.steps[ i ];
		var layer = new TGUI.GeneratorDefinitions[ step.type ].generator;

		for ( var id in step.params ) {
	
			layer.setParamValue( id, step.params[ id ] );

		}

		switch( step.operation ) {

			case '=': _texture.set( layer ); break;
			case '+': _texture.add( layer ); break;
			case '-': _texture.sub( layer ); break;
			case 'x': _texture.mul( layer ); break;
			case '/': _texture.div( layer ); break;
			case '&': _texture.and( layer ); break;
			case '^': _texture.xor( layer ); break;
			case 'min': _texture.min( layer ); break;
			case 'max': _texture.max( layer ); break;
		}
	}
	
	ctx.putImageData( _texture.toImageData( ctx ), 0, 0 );

}
var stepList;

function add( op ) {

	texture.add( op );
	render();

}

var currentGenerator = null;

function update( e ) {
	
	if ( e.srcElement.id.indexOf(".") !== -1 ) {

		var ids = e.srcElement.id.split(".");
		currentGenerator.params[ ids[ 0 ] ][ parseInt( ids[ 1 ] ) ] = e.srcElement.value;

	} else {

		currentGenerator.params[ e.srcElement.id ] = e.srcElement.value;

	}

	render();
}

function generatorSelected( id ) {

	if ( currentGenerator != null ) {
		generatorPanels[ currentGenerator.type ].dom.style.display = "none";
	}

	currentGenerator = texture.steps[ id ];
	var type = currentGenerator.type;
	generatorPanels[ type ].dom.style.display = "block";

	for ( var idParam in TGUI.GeneratorDefinitions[ type ].parameters ) {

		param = TGUI.GeneratorDefinitions[ type ].uiparameters[ idParam ];
		
		if ( param.length > 1 ) {
		
			for ( var i = 0; i < param.length; i++ )
				param[ i ].setValue( currentGenerator.params[ idParam ][ i ] );

		}
		else {

			param[ 0 ].setValue( currentGenerator.params[ idParam ] );
		}

	}

}

var generatorPanels = {};

var ctx;

function init() {

	var canvas = document.getElementById('preview');
	canvas.width = textureSize[ 0 ];
	canvas.height = textureSize[ 1 ];
	ctx = canvas.getContext('2d');

	var container = new UI.Panel();
	stepList = new UI.FancySelect();
	stepList.onChange( function () {

		generatorSelected( stepList.getValue() );

	} );

	document.getElementById("sidebar2").appendChild( stepList.dom );

	for ( var definitionId in TGUI.GeneratorDefinitions )
	{
		var panel = new UI.CollapsiblePanel();
		panel.setId( definitionId );

		panel.addStatic( new UI.Text().setValue( 'PARAMS ' + definitionId ) );
		generatorPanels[ definitionId ] = panel;

		panel.add( new UI.Break() );
		container.add( panel );

		var parameters = TGUI.GeneratorDefinitions[ definitionId ].parameters;
		TGUI.GeneratorDefinitions[ definitionId ].panel = panel;
		TGUI.GeneratorDefinitions[ definitionId ].uiparameters = {};
		for ( var idParam in parameters ) {
		
			var param = parameters[ idParam ];
			
			var row = new UI.Panel();
			
			TGUI.GeneratorDefinitions[ definitionId ].uiparameters[ idParam ] = [];

			row.setId( definitionId + "." + idParam );
			row.add( new UI.Text( idParam ).setWidth( '90px' ) );

			switch ( param.type ) {

				case "number": 
					var c = new UI.Number().setWidth( '50px' ).onChange( update ).setId( idParam );
					TGUI.GeneratorDefinitions[ definitionId ].uiparameters[ idParam ].push(c);

					row.add( c );
					break;

				case "vec2i": 
					var c1 = new UI.Integer().setWidth( '50px' ).onChange( update ).setId( idParam+'.0');
					var c2 = new UI.Integer().setWidth( '50px' ).onChange( update ).setId( idParam+'.1');
					TGUI.GeneratorDefinitions[ definitionId ].uiparameters[ idParam ].push(c1);
					TGUI.GeneratorDefinitions[ definitionId ].uiparameters[ idParam ].push(c2);
					row.add( c1, c2 );
					break;

				case "vec2f": 
					var c1 = new UI.Number().setWidth( '50px' ).onChange( update ).setId( idParam+'.0');
					var c2 = new UI.Number().setWidth( '50px' ).onChange( update ).setId( idParam+'.1');
					TGUI.GeneratorDefinitions[ definitionId ].uiparameters[ idParam ].push(c1);
					TGUI.GeneratorDefinitions[ definitionId ].uiparameters[ idParam ].push(c2);
					row.add( c1, c2 );
					break;

				case "boolean":
					var c = new UI.Checkbox().setWidth( '50px' ).onChange( update );
					TGUI.GeneratorDefinitions[ definitionId ].uiparameters[ idParam ].push(c);
					row.add( c );
					break;
				
				case "color":
					var c = new UI.Color().setWidth( '50px' );
					TGUI.GeneratorDefinitions[ definitionId ].uiparameters[ idParam ].push(c);
					row.add( c );
					break;

				default: 
					console.error("Unknown param type",param.type);
			}
			panel.add( row );
		}
		panel.dom.style.display = "none";
	}
	document.getElementById("sidebar").appendChild( container.dom );

}
