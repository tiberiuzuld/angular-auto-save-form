angular-auto-save-form
==============
 
 
## Description
 
Angular auto save form changed inputs.  
The directive will call the callback function with a parameter object containing only the inputs that are $dirty.
 
#### [Demo](http://tiberiuzuld.github.io/angular-auto-save-form)
 
#### Install with Bower
```bash
  bower install angular-auto-save-form --save
```

Then add a `<script>` to your `index.html`:

```html
  <script src="/bower_components/angular-auto-save-form/auto-save-form.js"></script>
```

## Usage

### Default usage:

Directive requires that form and input elements to have [name] attribute

```html
  <ng-form name="myForm" auto-save-form="callback"> 
    <input ng-model="user.name" name="name"/>
    <input ng-model="user.email" name="email"/>
  </ng-form>
```

Which expects a scope setup like the following:
```JavaScript
  $scope.user = { name: "Jon Doe", email: "jon.doe@domain.com" };
  
  //changing input user.name the callback function will be called with parameter object
  $scope.callback = function(controls){ // controls = {'name': 'Jon Doe'}
      $http.post('saveDataUrl', controls);
  };
```

#### Optional attribute:

If you want to change the locally default 500 debounce timer
```html
  auto-save-form-debounce="number"
```

If you want to change the debounce at input level use [ng-model-options] directive

##### The directive supports nested objects like:
```JavaScript
 user = {
  name: 'Jon Doe',
  country: {
    name: 'French',
    city: 'Paris'
  }
 }
```

```HTML
  <input ng-model="user.country.name" name="country.name"/>
```

```JavaScript
//callback object
 {
  country: {
    name: 'French'
  }
 }
```

### Alternatively, disable auto save usage:

###### Warning: Mode false works only with form tag see [this issue](https://github.com/angular/angular.js/issues/2513)  

```html
  <form name="myForm" auto-save-form="callback" auto-save-form-mode="boolean"> 
    <input ng-model="username" name="user"/>
  </form>
```

Which expects a scope setup like the following:
```JavaScript
  $scope.username = "Jon Doe";
  
  $scope.callback = function(controls, event){ // controls = {'user': 'Jon Doe'}, event={formSubmitEvent}
      $http.post('saveDataUrl', controls);
  };
```
#### Optional attribute:

It is optional if the property is set to false globally
```html
  auto-save-form-mode="boolean"
```

### Global configuration

In config phase add autoSaveFormProvider

```js
autoSaveFormProvider.setDebounce(number); //change global default 500 debounce timer
autoSaveFormProvider.setAutoSaveMode(boolean); //disable global default auto save set it false
```
### License
 The MIT License
 
 Copyright (c) 2016 Tiberiu Zuld
