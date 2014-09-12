Steve's Secret Server
---------------------

This repository contains a simple [node.js](http://nodejs.org/) server which is designed to distribute "secrets" within a networked environment.

What are secrets?  You get to decide, because this server will just handle the serving of JSON files, after ACL checks.

The use-case here is that several remote servers need to know usernames and passwords, and they shouldn't be encoded in a publicly visible source tree.  Instead they should be discovered at run-time.


Secret Protection
-----------------

Secrets are assumed to be stored in JSON files, and each collection ofsecrets is tied to an IP address.

For example your server might be running at http://secret.example.org/ and you might have two clients "10.0.0.2" and "10.0.0.3", each of those may
make a request for:

* http://secret.example.org/db

The first will be served the contents of `secrets/10.0.0.2/db.json`, and the second `secrets/10.0.0.3/db.json`.

A third client might make the same request and will just see an error - because the tree doesn't have any support for wildcard IPs and the request didn't match anything beneath our secret tree:

    |-- secrets
    |   `-- 10.0.0.2
    |       `-- db.json
    |   `-- 10.0.0.3
    |       `-- db.json
    `-- server.js



Security
--------

* If you don't trust the local network you should be running over SSL.
* Secrets can't leak
   * Remote clients cannot tell the difference between "Secret exists but isn't for you" and "Secret doesn't exist".
   * Remote clients can only make requests for which they've been authorized.
* We avoid PATH-traversal, NULL-bytes, and similar attacks.

Steve
--
