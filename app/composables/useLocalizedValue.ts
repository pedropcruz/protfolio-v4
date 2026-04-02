export function useLocalizedValue() {
  const { locale } = useI18n();

  const getLocalized = (value: any) => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value !== null) {
      return value[locale.value] || value['en'] || '';
    }
    return String(value);
  };

  return {
    getLocalized
  };
}
