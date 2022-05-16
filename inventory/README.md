# Description

This folder contains the description of some elements that can be added to a fres.co space.
The content is dynamically fetched within Fres.co in the Inventory menu when 'Elements' is picked.
The main file which is fetched is the file `index.json`

The `index.json` file is a JSON file containing an array of objects.
Each object consists of one element that can be added to a Fres.co space.
Each object should have the following properties :

- name: a unique name for this element
- url: an image URL to be used as a preview. It can be a string with either a full `https://` url, or a direct path within this directory.
- content: an object describing the elements.

# Adding an element

Any object or group of objects present in a fresco board can be exported as elements and added to this repository.
The export functionality is available with a feature flag. The string `useCopyToExport=true` has to be added as a query parameter of a Fres.co space URL.
When present, a new export button will be present in the item edition toolbar. Pressing that button will copy the exported value of the object in your system clipboard.

This copied string can then be pasted as the value of the `content` field of your new element in the index.json
