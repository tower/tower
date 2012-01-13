
doctype(5);

html(function() {
  head(function() {
    meta({
      charset: 'utf-8'
    });
    title(t('title'));
    meta({
      name: 'description',
      content: t('description')
    });
    meta({
      name: 'keywords',
      content: t('keywords')
    });
    stylesheets("vendor", "application");
    return javascripts("vendor", "lib", "application");
  });
  return body(function() {
    header(function() {
      h1(t('title'));
      return nav(function() {
        return ul(function() {
          if (this.path !== '/') {
            li(function() {
              return a({
                href: '/'
              }, function() {
                return 'Home';
              });
            });
          }
          switch (this.user.role) {
            case 'owner':
            case 'admin':
              return li(function() {
                return a({
                  href: '/admin'
                }, function() {
                  return 'Secret Stuff';
                });
              });
            case 'vip':
              return li(function() {
                return a({
                  href: '/vip'
                }, function() {
                  return 'Exclusive Stuff';
                });
              });
            default:
              return li(function() {
                return a({
                  href: '/commoners'
                }, function() {
                  return 'Just Stuff';
                });
              });
          }
        });
      });
    });
    section(function() {
      return yield();
    });
    return footer(function() {});
  });
});
