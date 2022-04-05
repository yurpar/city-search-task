


Importing data to mongodb

` cat ./cities_canada-usa.tsv | awk -F $'\t' '{ print "{ _id: "$1", name: \""$2"\", location: {type: \"Point\", coordinates: ["$6","$5"]}, country: \""$9"\", admin:\""$11"\"}"}' | sed $'1s/^.*$//' | mongoimport --db=task-db --collection=cities --type=json --drop`

By default city data stored at mongodb 'task-db' collection 'cities'

How to start

`npm i`

`npm run dev`
