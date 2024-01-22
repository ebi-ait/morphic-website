# data-catalogue
A generic catalogue.

## Demo
demo for [Morphic](https://9pw39w-4200.csb.app/).
The demo is served from the [demo branch](https://github.com/ebi-ait/data-catalogue/tree/demo)

Main branch [preview here](https://63msd8-4200.csb.app/)

## Development
See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Styling
Project specific styling such as brand colours & fonts should be limited to [styles.scss](./src/styles.scss).
Most of the styling can be changed by setting the correct css variable. For example:

```scss
.ag-theme-quartz {
  --ag-background-color: #F7F7F7;
  --ag-odd-row-background-color: #EBF2F3;
  --ag-font-family: Inter, "Helvetica Neue", sans-serif;
}
```
All ag-grid's css variables are available in the [ag-grid styling docs](https://ag-grid.com/angular-data-grid/global-style-customisation).
