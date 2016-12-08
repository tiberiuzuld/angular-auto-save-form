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

#### Install with npm
```bash
  npm install angular-auto-save-form --save
```

Then add a `<script>` to your `index.html`:

```html
  <script src="bower_components/angular-auto-save-form/auto-save-form.js"></script>
```

Include 'angular-auto-save-form' as a dependency of your module like this:
```JavaScript
  var module = angular.module("example", ["angular-auto-save-form"]);
```

## Usage

### Default usage:

Directive requires that form and input elements to have [name] attribute

```html
  <ng-form name="myForm" auto-save-form="callback(controls)"> 
    <input ng-model="user.name" name="name"/>
    <input ng-model="user.email" name="email"/>
  </ng-form>
```

Which expects a scope setup like the following:
```JavaScript
  $scope.user = { name: "Jon Doe", email: "jon.doe@domain.com" };
  
  //changing input user.name the callback function will be called with parameter object
  $scope.callback = function(controls){ // controls = {'name': 'Jon Doe'}
      return $http.post('saveDataUrl', controls);
  };
```

For radio inputs or if you want to group inputs on the same property use the [auto-save-form-property] attribute  
on one of the inputs and prefix the input name with a group name

```html
  <ng-form name="myForm" auto-save-form="callback(controls)"> 
    <input type="radio" ng-model="user.gender" name="inputGroupName.gender1" 
      auto-save-form-property="inputGroupName.gender" value="male"/>Male
    <input type="radio" ng-model="user.gender" name="inputGroupName.gender2" value="female"/>Female
  </ng-form>
```
The object will look like this:

```JavaScript
  //{'gender': 'male'}
```

#### Optional attributes:

If you want to change locally debounce timer
```html
  auto-save-form-debounce="number" default:500
```

If you want to change the debounce at input level use [ng-model-options] directive

Loading spinner in top right corner of the form enabled by default if callback promise returns a promise.
```html
  auto-save-form-spinner="boolean"  default:true
```

```html
  auto-save-form-spinner-position="string"  default:'top right'
```

Possible combinations: 'top right', 'top left', 'bottom left', 'bottom right'.  
It is possible to add your own class without your desired position.  
Example:
```css
[auto-save-form] .spinner.my-class {
    top: 50%;
    left: 50%;
  }
```
```html
  auto-save-form-spinner-position="my-class"
```


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
  <form name="myForm" auto-save-form="callback(controls, $event)" auto-save-form-mode="boolean"> 
    <input ng-model="username" name="user"/>
  </form>
```

Which expects a scope setup like the following:
```JavaScript
  $scope.username = "Jon Doe";
  
  $scope.callback = function(controls, $event){ // controls = {'user': 'Jon Doe'}, $event={formSubmitEvent}
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
  autoSaveFormProvider.setDebounce(500); //change globaly default debounce timer
  autoSaveFormProvider.setAutoSaveMode(true); //change globaly default auto save mode
  autoSaveFormProvider.setSpinner(true); //change globaly default spinner
  autoSaveFormProvider.setSpinnerPosition('top right'); //change globaly default position of the spinner
```
### License
 The MIT License
 
 Copyright (c) 2016 Tiberiu Zuld
