# Espouse Theme - Project TODOs

> **Comprehensive Roadmap:** See `docs/roadmap.md` for complete 6-phase improvement plan
>
> **Atomic Task Breakdown:** See `docs/tasks/phase1-critical-updates.md` for detailed implementation steps

---

## 🚨 IMMEDIATE PRIORITIES (Phase 1: Critical Updates)

**Status:** NOT STARTED
**Effort:** 12-16 hours total
**Deadline:** Complete within 2-4 weeks

### Security & Toolchain Modernization

These tasks address critical technical debt and security vulnerabilities. See `docs/tasks/phase1-critical-updates.md` for detailed atomic breakdown.

#### ✅ Task 1.1: Security Audit & Vulnerability Resolution (1-2h) - START HERE
- [ ] Run comprehensive npm audit
- [ ] Document all critical/high severity vulnerabilities
- [ ] Apply security patches
- [ ] Verify zero critical/high vulnerabilities remain
- [ ] **Success:** Clean npm audit, working build

#### ✅ Task 1.2: jQuery Security Update (1h)
- [ ] Update jQuery 3.5.1 → 3.7.1
- [ ] Test all jQuery-dependent functionality
- [ ] Verify no breaking changes
- [ ] **Success:** Updated jQuery, no regressions

#### ✅ Task 1.3: Babel Toolchain Update (1-2h)
- [ ] Update @babel/core 7.11.4 → 7.28.5
- [ ] Update @babel/preset-env 7.11.0 → 7.28.5
- [ ] Update babel-loader 8.1.0 → 8.4.1
- [ ] Test transpilation
- [ ] **Success:** Modern Babel, successful builds

#### ✅ Task 1.4: Replace node-sass with Dart Sass (2-3h) ⚠️ BLOCKS Task 1.5
- [ ] Remove node-sass from dependencies
- [ ] Install sass (Dart Sass) 1.x
- [ ] Update sass-loader 9.0.3 → 16.0.6
- [ ] Update webpack.config.js sass-loader configuration
- [ ] Update gulpfile.js for Dart Sass
- [ ] Test Sass compilation
- [ ] Verify CSS output correctness
- [ ] **Success:** Dart Sass working, node-sass removed

#### ✅ Task 1.5: Gulp 3.x → 5.x Migration (3-4h) ⚠️ DEPENDS ON Task 1.4
- [ ] Backup current gulpfile.js
- [ ] Update Gulp 3.9.1 → 5.0.1
- [ ] Update gulp-sass → 6.0.1
- [ ] Rewrite gulpfile.js for Gulp 5 API
  - Convert task definitions to function exports
  - Use gulp.series() and gulp.parallel()
  - Update stream handling
- [ ] Test all Gulp tasks individually
- [ ] Verify Semantic UI build process
- [ ] **Success:** Gulp 5 working, all tasks functional

#### ✅ Task 1.6: Template Bug Fixes & Validation (2h)
- [ ] Review recent pagination fixes (commits 3212737-408798f)
- [ ] Audit all template pagination usage
- [ ] Fix layouts/partials/meta.html defensive guards
- [ ] Create error boundary template
- [ ] Test all page types (home, list, single, photography, 404)
- [ ] Document template requirements
- [ ] **Success:** Zero template errors, all pages render

#### ✅ Task 1.7: Integration Testing & Verification (1h) - DO LAST
- [ ] Clean build from scratch
- [ ] Verify npm audit clean
- [ ] Test all Gulp tasks
- [ ] Test webpack builds
- [ ] Hugo site build test
- [ ] Browser testing all page types
- [ ] Run Lighthouse baseline audit
- [ ] Document results
- [ ] **Success:** All systems working together

### Execution Order

**Recommended Sequence:**
1. Task 1.1 (Security Audit) - FIRST
2. Tasks 1.2, 1.3, 1.6 in parallel (independent)
3. Task 1.4 (node-sass → sass)
4. Task 1.5 (Gulp migration) - AFTER 1.4
5. Task 1.7 (Integration test) - LAST

**Critical Path:** 1.1 → 1.4 (2-3h) → 1.5 (3-4h) → 1.7 (1h) = ~7-9 hours

---

## 🎯 CURRENT ISSUES

### Hugo Template Errors (Partially Fixed)
**Status:** IN PROGRESS
**Recent Fixes:** Commits 3212737, 2173b93, 639fef9, 408798f

**Remaining Work:**
- Complete Task 1.6 above for full resolution
- Add comprehensive validation
- Create error boundary templates

---

## 📋 UPCOMING FEATURES

### Dark Mode Implementation 🌓 (Phase 3)
**Status:** PLANNED
**Effort:** 8-10 hours
**Priority:** MEDIUM (after Phase 1 & 2 complete)

See `docs/roadmap.md` Phase 3.1 for full details.

**High-Level Steps:**
1. **CSS Theming Foundation**
   - Create base CSS variables for color schemes
   - Implement dark mode class override
   - Ensure proper contrast ratios

2. **UI Control Components**
   - Add theme toggle button to header
   - Create dark/light mode icons (sun/moon) using existing icon classes
   - Implement ARIA labels for accessibility

3. **JavaScript Integration**
   - Create theme manager class for mode switching
   - Add localStorage persistence for user preference
   - Add toggle event listeners

4. **System Preference Detection**
   - Implement `prefers-color-scheme` media query detection
   - Add automatic update when system theme changes

5. **Testing Plan**
   - Cross-browser compatibility checks
   - Test dynamic content theming
   - Validate accessible contrast levels (WCAG AA)

**Success Criteria:**
- Functional dark/light toggle
- Preference persistence across sessions
- System preference detection
- WCAG 2.1 AA contrast compliance

---

## 🔄 SHORT-TERM GOALS (Phase 2: 1-3 months)

See `docs/roadmap.md` Phase 2 for details.

### Build System Modernization
- [ ] Webpack 4 → 5 migration
- [ ] Performance optimization (30-50% bundle reduction target)
- [ ] CSS pipeline modernization
- [ ] Implement lazy loading for particles.js

**Effort:** 20-24 hours
**Value:** Faster builds, smaller bundles, better DX

---

## 📈 MEDIUM-TERM GOALS (Phase 3: 3-6 months)

See `docs/roadmap.md` Phase 3 for details.

### Feature Enhancements
- [ ] Dark mode implementation (above)
- [ ] Accessibility audit & WCAG 2.1 AA compliance
- [ ] Progressive Web App features
  - Web app manifest
  - Service worker
  - Offline support

**Effort:** 16-20 hours
**Value:** Modern UX, accessibility, offline capability

---

## 🎓 LONG-TERM VISION (Phase 4-6: 6+ months)

See `docs/roadmap.md` Phases 4-6 for details.

### Code Modernization
- [ ] JavaScript modernization (reduce jQuery dependency)
- [ ] CSS modernization (custom properties, Grid, modern features)
- [ ] Asset optimization (WebP/AVIF, SVG sprites, font optimization)

### Developer Experience
- [ ] Comprehensive documentation
- [ ] Testing infrastructure (Lighthouse CI, visual regression)
- [ ] Tooling improvements (Prettier, Husky, commitlint)

### Content Features
- [ ] Additional content types (blog, portfolio, resume)
- [ ] Enhanced photography features (lightbox, EXIF, collections)
- [ ] Social & sharing enhancements

---

## 📊 Success Metrics

**Performance Targets:**
- Bundle size: 30-50% reduction
- Build time: <10 seconds
- Lighthouse scores: 95+ all categories

**Security Targets:**
- Zero critical/high vulnerabilities
- Automated security scanning
- Regular dependency updates

**Quality Targets:**
- WCAG 2.1 AA compliance
- Zero template errors
- Comprehensive test coverage

---

## 📚 Documentation

### Created Documentation
- [x] `docs/roadmap.md` - Comprehensive 6-phase improvement roadmap
- [x] `docs/tasks/phase1-critical-updates.md` - Atomic task breakdown for Phase 1

### Needed Documentation
- [ ] Theme customization guide
- [ ] Configuration options reference
- [ ] Build process documentation
- [ ] Contribution guidelines
- [ ] Component documentation

---

## 🔗 Quick Links

- **Main Roadmap:** `docs/roadmap.md`
- **Phase 1 Tasks:** `docs/tasks/phase1-critical-updates.md`
- **Bug Tracking:** `docs/bugs/` (to be created as needed)
- **Security Audits:** `docs/security-audit-*.json` (created during Task 1.1)

---

## 📝 Notes

**Last Updated:** 2025-11-26
**Current Phase:** Phase 1 - Critical Updates (NOT STARTED)
**Next Action:** Execute Task 1.1 (Security Audit)

**Key Dependencies:**
- Semantic UI 2.4.2 (currently maintained, limited updates)
- Hugo compatibility (test with current Hugo version)
- Browser support: Last 2 versions + modern browsers

**Risks:**
- Webpack 5 migration has breaking changes
- Gulp 3 → 5 requires significant gulpfile rewrite
- Semantic UI requires jQuery (cannot fully remove jQuery)
