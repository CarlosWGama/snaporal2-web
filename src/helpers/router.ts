import Cookies from "js-cookie";

/**
 * DADOS SALVOS TEMPORARIAMENTE
 * IDEAL PARA MANDAR UMA INFORMAÇÃO DE UMA TELA PARA OUTRA PARA CONFIRMAR AÇÃO 
 * @example
 *      /tela1
 *          setFlashData('Usuário cadastrado com sucesso');
 * 
 *      /tela2
 *          const response = getFlashData();
 */

//SALVA FLASH DATA
export function setFlashData(data:any) {
    Cookies.set(`flash`, JSON.stringify(data));
}
//RECUPERA FLASH DATA
export function getFlashData() {
    const data = Cookies.get(`flash`);
    if (data) {
        Cookies.remove(`flash`);
        return JSON.parse(data);
    }
    return null;
}
//REMOVE QUALQUER FLASH DATA
export function clearFlashData() {
    Cookies.remove(`flash`);
}