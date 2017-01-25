class SimplePromise {
  constructor (executor) {
    this.state = 'pending'; // 3 states pending, resolved, rejected
    this.result = null; // initially set to null
    this.callbacks = [];

    executor(this.resolve.bind(this), this.reject.bind(this));
  }

  then(onResolved, onRejected) {
    return new SimplePromise((resolved, rejected) => {
      if (this.state === 'resolved')
        return this.onResolved();
      else {
        return this.callbacks.push({
          onResolved: onResolved,
          onRejected: onRejected
        });
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  resolve(value) {
    // if value is another promise
    if(value && typeof value.then === 'function') {
      value.then(resolve, reject);
      return;
    }
    this.state = 'resolved';
    this.result = value;

    if (this.state === 'rejected') {
      this.onRejected(value);
    } else {
      this.onResolved(value);
    }

    return this;
  }

  reject(error) {
    if(this.state === 'resolved') return;
    this.status = 'rejected';
    this.result = error;
    release(error);
  }


  onResolved(result) {
    if(this.state === 'resolved') return;
    this.status = 'resolved';
    release(result);
  }


  release(value) {
    this.result = value;
    this.callbacks.forEach((data) => {
      this.release(data.onResolved, data.onRejected);
    }, this)
  }
}


/*
* Trying the Simple promise
* Example inspired from MDN
*/

var promiseCount = 0;

(function testPromise() {
    var thisPromiseCount = ++promiseCount;

    var p1 = new SimplePromise(
        function(resolve, reject) {
            console.log('Promise started');

            setTimeout(
                function() {
                    // We fulfill the promise !
                    resolve(thisPromiseCount);
                }, Math.random() * 2000 + 1000);
        }
    );

    p1.then(
        function(val) {
            console.log(val + ' - Promise resolved');
        })
    .catch(
        function(reason) {
            console.log('Handle rejected promise ('+reason+') here.');
        });

    console.log('Promise made');
})();
