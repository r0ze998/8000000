
{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x
    pkgs.nodePackages.npm
    pkgs.nodePackages.typescript
    pkgs.nodePackages.typescript-language-server
    pkgs.psmisc
  ];
}
