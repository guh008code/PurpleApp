export default class Utilidades {


     static setFormatPlaqueta = (value: string) => {
            let sValue = value.replace(/[^0-9]/g, '');
            let valor = parseInt(sValue);
            if (valor < 10) {
                  sValue = '00000' + valor.toString()
            }
            else if (valor < 100) {
                  sValue = '0000' + valor.toString()
            }
            else if (valor < 1000) {
                  sValue = '000' + valor.toString()
            }
            else if (valor < 10000) {
                  sValue = '00' + valor.toString()
            }
            else if (valor < 100000) {
                  sValue = '0' + valor.toString()
            }
            return sValue
      }

static formatarCNPJ = (cnpj: string) => {
    return cnpj
      .replace(/\D/g, '') // Remove tudo que não for número
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 18); // Garante o tamanho máximo
  };

  static isEmpty = (value) => {
      return (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
      );
    };

}

