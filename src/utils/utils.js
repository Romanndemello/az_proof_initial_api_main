
class Utils {
    diacriticSensitiveRegex = (string = '') => {
        return string
            .replace(/a/g, '[a,á,à,ä,â,ã]')
            .replace(/A/g, '[a,á,à,ä,â,ã]')
            .replace(/e/g, '[e,é,ë,è]')
            .replace(/E/g, '[e,é,ë,è]')
            .replace(/i/g, '[i,í,ï,ì]')
            .replace(/I/g, '[i,í,ï,ì]')
            .replace(/o/g, '[o,ó,ö,ò,õ]')
            .replace(/O/g, '[o,ó,ö,ò,õ]')
            .replace(/u/g, '[u,ü,ú,ù]')
            .replace(/U/g, '[u,ü,ú,ù]')
            .replace(/c/g, '[c,ç]')
            .replace(/C/g, '[c,ç]');
    };
}

export default new Utils();
