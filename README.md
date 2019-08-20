# Extrusion panel

The Extrusion panel plugin allows to extrude geometries provided as [GeoJSON](https://tools.ietf.org/html/rfc7946).

## Build

### Development build

To build the plugin for the use in the development:
```
yarn dev
```
This will run linting tools and apply prettier fix.


In addition you can use the following to get an index.html which can be used for stand-alone testing:
```
yarn watch
```

### Production build

To build the plugin for the use in production:
```
yarn build
```