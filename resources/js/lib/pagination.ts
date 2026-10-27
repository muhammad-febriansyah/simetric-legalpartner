export type PaginationDirection = 'previous' | 'next';

export function paginationDirection(label: string): PaginationDirection | null {
    const normalizedLabel = label.toLowerCase();

    if (normalizedLabel.includes('previous')) {
        return 'previous';
    }

    if (normalizedLabel.includes('next')) {
        return 'next';
    }

    return null;
}

export function paginationLabel(label: string): string {
    const direction = paginationDirection(label);

    if (direction === 'previous') {
        return 'Sebelumnya';
    }

    if (direction === 'next') {
        return 'Berikutnya';
    }

    return label.replace('&laquo;', '‹').replace('&raquo;', '›');
}
