<style>
.tm-price-info {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
## Price Info

Price Info used to display the sum and part sum. See examples to understand it better.

### Basic usage

:::demo Use `type` [`paid`, `not-paid`, `part-paid`] to define Info Price's style.

```html
<div>
  <tm-price-info :sum="12560.10" type="paid" currency="star" size="small" taxes-info></tm-price-info>
  <tm-price-info :sum="22560.56" type="paid" currency="star" size="medium" taxes-info></tm-price-info>
  <tm-price-info :sum="32560.23" type="paid" currency="star" size="large" taxes-info></tm-price-info>
  <tm-price-info :sum="42560.00" type="not-paid" currency="star" size="large" taxes-info></tm-price-info>
  <tm-price-info :sum="52560.00" :part-sum="17560.00" type="part-paid" currency="star" size="large" taxes-info></tm-price-info>
</div>
```
:::


### Attributes
| Attribute      | Description    | Type      | Accepted values       | Default   |
|---------- |-------- |---------- |-------------  |-------- |
| sum     | value sum  | string    |   - |     —    |
| partSum     |  value part sum | string    |   - |     —    |
| type     | type price info  | string    |   paid / not-paid / part-paid |     —    |
| currency     | type of currency  | string    |   rub / usd / eur |     —    |
| size     | size price info  | string    |   small / medium / large |     —    |
| taxesInfo     | taxes on/off  | Boolean    |   false / true |     false    |