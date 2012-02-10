/*jslint strict: false, plusplus: false, evil: true */
/*global document: false, location: false */

(function () {
    var args = location.search.substring(1),
        parts = args.split('&'),
        dohPath = location.href,
        pathRegExp = /\.\.|:|\/\//,
        html = '',
        i, part, multi, key;

    args = {};

    //Build up the args from querystring parts.
    for ( i = 0; (part = parts[i]); i++ ) {
		if ( part.indexOf("[]=") > -1 ) {
			multi = part.split("[]=");
			key = decodeURIComponent( multi[0] );
			if ( ! args[ key ] ) {
				args[ key ] = [];
			}
			args[ key ].push( decodeURIComponent( multi[1] ));
		} else {
			part = part.split('=');
			args[decodeURIComponent(part[0])] = decodeURIComponent(part[1]);
		}
    }

    //Set up dohPath
    i = dohPath.indexOf('/tests/');
    dohPath = dohPath.substring(0, i + 1) + 'tests/doh/';

    function write(path) {
        html += '<' + 'script src="' + path + '"></' + 'script>';
    }

    //Only allow impl and config args that do not have relative paths
    //or protocols. Do this to avoid injection attacks on domains that
    //host the test files.
    if (pathRegExp.test(args.impl) || pathRegExp.test(args.config)) {
        alert('invalid impl or config path');
        return;
    }

	if ( args.impl.constructor == Array ) {
		for ( i = 0; i < args.impl.length; i++ ) {
			write('../../impl/' + args.impl[i] );
		}
	} else {
		write('../../impl/' + args.impl);
	}
    write('../../impl/' + args.config);

    if (location.href.indexOf('doh/runner.html') === -1) {
        write(dohPath + 'runner.js');
        write(dohPath + '_browserRunner.js');
    } else {
        write('../tests.js');
    }

    document.write(html);
}());
