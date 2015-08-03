# JSONStore speed tester
Application project for testing speed of MobileFirst Platform JSONStore. All tasks providing speed tracking.

Build with platform version: 7.0

![alt tag](https://www.dropbox.com/s/vrxvlzr71zqvc9g/jsonspeedtester_1.0.png?dl=1)

###Current functions:
* Init store with collection
* Close collection
* Destroy store
* Put data (from 1K documents to 100K)
* Get data (search for index 999)
* Count items in store

Putting document example:

```js
[
    {
        "index": 1,
        "index_start_at": 56,
        "integer": 41,
        "float": 11.2476,
        "name": "Joan",
        "surname": "Huffman",
        "fullname": "Faye Burgess",
        "email": "calvin@brennan.lt",
        "bool": false
    }
]
```


### TODO:
* Fix timings for portioning array
* Add encryption tests
