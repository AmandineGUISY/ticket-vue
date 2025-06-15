export interface PasswordStrengthResult {
    score: number;
    label: string;
    colorClass: string;
}

export function checkPasswordStrength(password: string): PasswordStrengthResult {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const score = (strength / 5) * 100;

    let label = 'Faible';
    let colorClass = 'bg-danger';

    if (score > 80) {
        label = 'Parfait';
        colorClass = 'bg-success';
    } else if (score >= 80) {
        label = 'Fort';
        colorClass = 'bg-success';
    } else if (score >= 40) {
        label = 'Moyen';
        colorClass = 'bg-warning';
    }

    return {
        score,
        label,
        colorClass
    };
}

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
