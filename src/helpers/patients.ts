export function getDescriptionGender(gender: string) {
    switch (gender) {
        case 'male':
            return 'Masculino';
        case 'female':
            return 'Feminino';
        case 'other':
            return 'Outro';
        default:
            return 'Desconhecido';
    }
}