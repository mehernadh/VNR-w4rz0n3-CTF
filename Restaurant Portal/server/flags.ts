export interface FlagConfig {
  id: string;
  flag: string;
  description: string;
}

export const FLAGS: Record<string, FlagConfig> = {
  ROBOTS_TXT: {
    id: 'robots_txt',
    flag: 'w4rz0n3{r0b0ts_t3ll_s3cr3ts}',
    description: 'Found in robots.txt file',
  },
  REGISTRATION: {
    id: 'registration',
    flag: 'w4rz0n3{r3g1str4t10n_fl4g_f0und}',
    description: 'Discovered during account registration',
  },
  IDOR_ADMIN: {
    id: 'idor_admin',
    flag: 'w4rz0n3{1d0r_4dm1n_4cc3ss}',
    description: 'IDOR vulnerability - accessing admin profile',
  },
  SQL_INJECTION: {
    id: 'sql_injection',
    flag: 'w4rz0n3{sql_1nj3ct10n_m4st3r}',
    description: 'SQL injection in search endpoint',
  },
  XSS_COMMENT: {
    id: 'xss_comment',
    flag: 'w4rz0n3{xss_c0mm3nt_h4ck}',
    description: 'XSS vulnerability in review responses',
  },
};

export class FlagService {
  static getFlag(flagId: string): string | null {
    const flagConfig = Object.values(FLAGS).find(f => f.id === flagId);
    return flagConfig ? flagConfig.flag : null;
  }

  static validateRegistration(): { success: boolean; flag?: string; message: string } {
    return {
      success: true,
      flag: FLAGS.REGISTRATION.flag,
      message: 'Registration successful! Check console for debug information.',
    };
  }

  static validateXSS(responseData: string): { success: boolean; flag?: string; message: string } {
    const containsPotentialHTML = (input: string): boolean => {
      if (!input) return false;
      return input.includes('<') || input.includes('&');
    };

    if (containsPotentialHTML(responseData)) {
      return {
        success: true,
        flag: FLAGS.XSS_COMMENT.flag,
        message: 'XSS vulnerability detected! Advanced payload successful.',
      };
    }

    return {
      success: false,
      message: 'No XSS payload detected.',
    };
  }
}
