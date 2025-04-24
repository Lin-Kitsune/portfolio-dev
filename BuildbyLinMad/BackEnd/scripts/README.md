# 🛠 Scripts de Transformación de Componentes - BuildByLinMad

Este conjunto de scripts fue creado para **transformar y estructurar los datos brutos almacenados en MongoDB** para cada categoría de componentes del sistema `Arma tu PC`.  
Los documentos originales contenían campos como `price` en formato string y `specs` como cadenas de texto planas.  
Estos scripts los convierten en **objetos estructurados y tipados**, optimizados para su uso en frontend (React Native) y backend (MongoDB).

---

## 📁 Estructura de los Scripts

Cada script realiza:

- Limpieza de campos (`price` → número, `model` desde el `name`, etc.)
- Transformación del campo `specs` (de `string` a `object`)
- Actualización directa sobre la colección correspondiente

---

## 📦 Scripts disponibles

| Archivo | Colección | Qué transforma |
|--------|-----------|----------------|
| `transformar-cpus.cjs` | `processors` | Frecuencia, núcleos, hilos, cachés, arquitectura, socket |
| `transformar-gpus.cjs` | `gpus` | GPU, memoria, frecuencias, bus, tipo de memoria |
| `transformar-motherboards.cjs` | `motherboards` | Socket, chipset, memorias, formato |
| `transformar-psus.cjs` | `psus` | Potencia, certificación, corriente, modularidad, PFC |
| `transformar-rams.cjs` | `rams` | Capacidad, tipo, velocidad, formato, voltaje |
| `transformar-ssds.cjs` | `ssds` | Capacidad, formato, bus, tipo memoria, DRAM |
| `transformar-cases.cjs` | `cases` | Formato, iluminación, fuente incluida, ventiladores, lateral |
| `transformar-coolers.cjs` | `coolers` | RPM, flujo de aire, altura, ruido, peso |
| `transformar-disks.cjs` | `disks` | Capacidad, RPM, bus, tamaño, tipo |
| `transformar-fans.cjs` | `fans` | Tamaño, iluminación, flujo, ruido, RPM, tipo de bearing |

---

## 🚀 ¿Cómo ejecutar un script?

Desde la raíz del proyecto, entra a la carpeta `scripts/`:

```bash
cd scripts
node transformar-[componente].cjs
