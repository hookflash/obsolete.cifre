*Status: DEV*

Cifre
=====

Cifre is a fast crypto toolkit for modern client-side JavaScript. This is done by taking the best crypto code for js on the net and updating it to use modern technologies.

There are plans to collaborate with the amazing [forge](https://github.com/digitalbazaar/forge) project. See [Issue 3](https://github.com/openpeer/cifre/issues/3).


Install
-------

	npm install cifre


Development
-----------

Development is done on NodeJS but the library is intended to be used in the browser.

A major cleanup and refactor is planned once collaboration with `forge` progresses.

### Notes

Import from [forge](https://github.com/digitalbazaar/forge):

	git clone git@github.com:digitalbazaar/forge.git ~/forge
	cp -f ~forge/js/*.js ./forge
	cd ./forge
	rm debug.js forge.js form.js http.js log.js pkcs7.js socket.js task.js tls.js tlssocket.js xhr.js 


License
=======

The `cifre` code is licensed under MIT.

The `cifre` code incorporates code from `forge` which is licensed under BSD or GPL. See [here](https://github.com/digitalbazaar/forge/blob/master/LICENSE).
