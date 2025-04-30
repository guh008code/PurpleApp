export default class Utilidades {


static setFormatPlaqueta(value){
    if (value.toString().length < 10) {
          value = '00000' + value
    }
    else if (value.toString().length < 100) {
          value = '0000' + value
    }
    else if (value.toString().length < 1000) {
          value = '000' + value
    }
    else if (value.toString().length < 10000) {
          value = '00' + value
    }
    else if (value.toString().length < 100000) {
          value = '0' + value
    }

    return value
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

}