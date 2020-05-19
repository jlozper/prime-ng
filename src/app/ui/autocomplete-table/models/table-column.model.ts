export interface TableColumn<T> {
  label: string; // Nombre de la columna
  field: string;
  value?: string | ((row: T) => string); // Coge este valor por defecto, sino coge el valor de row.field
}
