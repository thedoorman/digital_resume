function postReq(){
    var name = document.getElementsByName("name")[0].value;
    var email = document.getElementsByName("email")[0].value;
    var message = document.getElementsByName("message")[0].value;
    let promise = new Promise((resolve, reject) => {
        let apiURL = `https://api.jesseclark.io/contactMe?name=${name}&email=${email}&message=${message}`;
        this.http.post(apiURL)
          .toPromise()
          .then(
            res => { // Success
              console.log(res.json());
              resolve();
            }
          );
      });
      return promise;
    }