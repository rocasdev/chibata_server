export function generateSlug(title: string) {
  return title
    .toLowerCase() // Convertir todo a minúsculas
    .trim() // Eliminar espacios en blanco al inicio y final
    .replace(/[\s\W-]+/g, "-") // Reemplazar espacios y caracteres especiales por guiones
    .replace(/^-+|-+$/g, ""); // Eliminar guiones al principio o final
}
