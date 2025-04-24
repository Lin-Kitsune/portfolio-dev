export const isCompatible = (
  type: string,
  currentBuild: any,
  candidate: any
): { compatible: boolean; reason?: string } => {
  const specs = candidate?.specs || {};

  const normalize = (s: string) =>
    s?.toString().trim().toUpperCase().replace(/\s+/g, '') || '';

  const getSocket = (component: any) =>
    component?.specs?.socket ? normalize(component.specs.socket) : '';

  const cpuSocket = getSocket(currentBuild?.cpu);
  const motherboardSocket = getSocket(currentBuild?.motherboard);
  const candidateSocket = getSocket(candidate);

  console.log('🔍 isCompatible():');
  console.log('Tipo:', type);
  console.log('CPU Socket:', cpuSocket);
  console.log('MB Socket:', motherboardSocket);
  console.log('Candidato Socket:', candidateSocket);

  if (type === 'cpu' && candidate.name?.toLowerCase().includes('intel')) {
    if (!/^LGA\d+$/i.test(candidateSocket)) {
      return {
        compatible: false,
        reason: `El CPU Intel no tiene un socket válido (detectado: "${candidateSocket}")`,
      };
    }
  }

  // Verifica socket entre CPU y MB
  if (type === 'cpu' && motherboardSocket && candidateSocket) {
    if (candidateSocket !== motherboardSocket) {
      console.warn(`❌ CPU (${candidateSocket}) ≠ MB (${motherboardSocket})`);
      return {
        compatible: false,
        reason: `Socket del CPU (${candidateSocket}) no coincide con la placa madre (${motherboardSocket})`,
      };
    }
  }

  if (type === 'motherboard' && cpuSocket && candidateSocket) {
    if (candidateSocket !== cpuSocket) {
      console.warn(`❌ MB (${candidateSocket}) ≠ CPU (${cpuSocket})`);
      return {
        compatible: false,
        reason: `Socket de la placa madre (${candidateSocket}) no coincide con el CPU (${cpuSocket})`,
      };
    }
  }

  // Verifica RAM ↔ Motherboard
// Verifica RAM ↔ Motherboard
if (type === 'ram' && currentBuild?.motherboard?.specs?.memorias) {
  const ramTipo = normalize(specs.tipo);
  const motherMemorias = normalize(currentBuild.motherboard.specs.memorias?.tipo);
  if (ramTipo && motherMemorias && !ramTipo.includes(motherMemorias) && !motherMemorias.includes(ramTipo)) {
    return {
      compatible: false,
      reason: `RAM (${specs.tipo}) no compatible con la placa madre (${currentBuild.motherboard.specs.memorias?.tipo})`,
    };
  }
}

if (type === 'motherboard' && currentBuild?.ram?.specs?.tipo) {
  const ramTipo = normalize(currentBuild.ram.specs.tipo);
  const memorias = normalize(specs.memorias?.tipo);
  if (ramTipo && memorias && !ramTipo.includes(memorias) && !memorias.includes(ramTipo)) {
    return {
      compatible: false,
      reason: `La placa madre no es compatible con RAM tipo ${currentBuild.ram.specs.tipo}`,
    };
  }
}

  return { compatible: true };
};
