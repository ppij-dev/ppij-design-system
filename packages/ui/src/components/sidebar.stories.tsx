import type { Meta, StoryObj } from "@storybook/react";
import {
  SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuBadge, SidebarGroup, SidebarGroupLabel,
  SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton,
  SidebarInset, SidebarTrigger, SidebarSeparator, SidebarInput,
} from "./sidebar";
import {
  IconHome, IconUsers, IconCalendar, IconMail, IconSettings, IconLogout,
  IconUserCheck, IconSend, IconId, IconBuilding, IconShieldCheck, IconSearch,
} from "@tabler/icons-react";

const meta: Meta<typeof Sidebar> = { title: "Admin/Sidebar", component: Sidebar,
  argTypes: {
    side: { control: "select", options: ["left", "right"] },
    variant: { control: "select", options: ["sidebar", "floating", "inset"] },
    collapsible: { control: "select", options: ["offcanvas", "icon", "none"] },
  },
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

export const AdminShell: Story = {
  render: () => (
    <SidebarProvider>
      <div style={{ display: "flex", width: "100%", minHeight: 560, border: "1px solid #e3e5e8", borderRadius: 12, overflow: "hidden" }}>
        <Sidebar>
          <SidebarHeader>
            <strong style={{ padding: "4px 8px" }}>PPIJ Admin</strong>
            <SidebarInput placeholder="Cari menu..." />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu utama</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem><SidebarMenuButton isActive><IconHome size={16} /> Beranda</SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton><IconUsers size={16} /> Anggota</SidebarMenuButton>
                  <SidebarMenuBadge>128</SidebarMenuBadge>
                  <SidebarMenuSub>
                    <SidebarMenuSubItem><SidebarMenuSubButton isActive>Daftar anggota</SidebarMenuSubButton></SidebarMenuSubItem>
                    <SidebarMenuSubItem><SidebarMenuSubButton>Verifikasi berkas</SidebarMenuSubButton></SidebarMenuSubItem>
                    <SidebarMenuSubItem><SidebarMenuSubButton>Undangan</SidebarMenuSubButton></SidebarMenuSubItem>
                    <SidebarMenuSubItem><SidebarMenuSubButton>Kartu anggota</SidebarMenuSubButton></SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton><IconUserCheck size={16} /> Antrean review</SidebarMenuButton>
                  <SidebarMenuBadge>7</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton><IconCalendar size={16} /> Kegiatan</SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton><IconMail size={16} /> Pesan</SidebarMenuButton></SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Wilayah</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem><SidebarMenuButton><IconBuilding size={16} /> Komsat</SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton><IconId size={16} /> Unit dan cabang</SidebarMenuButton></SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup>
              <SidebarGroupLabel>Pengaturan</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem><SidebarMenuButton><IconShieldCheck size={16} /> Peran dan akses</SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton><IconSend size={16} /> Pengumuman</SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton><IconSettings size={16} /> Umum</SidebarMenuButton></SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem><SidebarMenuButton><IconLogout size={16} /> Keluar</SidebarMenuButton></SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div style={{ padding: 16 }}>
            <SidebarTrigger />
            <h3 style={{ margin: "12px 0 4px" }}>Beranda admin</h3>
            <p style={{ color: "#5b6168", margin: 0, maxWidth: 520 }}>
              Sidebar memuat grup menu, sub menu yang terbuka di bawah item induk, dan lencana jumlah
              untuk antrean yang hidup. Di telepon, navigasi utama memakai BottomBar; sidebar menjadi
              laci dari tombol menu. <IconSearch size={14} style={{ verticalAlign: -2 }} /> Cari menu memfilter daftar ini di aplikasi.
            </p>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
};

export const Playground: Story = {
  args: { side: "left", variant: "sidebar", collapsible: "offcanvas" },
  render: (args) => (
    <SidebarProvider>
      <div style={{ display: "flex", width: "100%", minHeight: 480, border: "1px solid #e3e5e8", borderRadius: 12, overflow: "hidden" }}>
        <Sidebar {...args}>
          <SidebarHeader>
            <strong style={{ padding: "4px 8px" }}>PPIJ Admin</strong>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu utama</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem><SidebarMenuButton isActive><IconHome size={16} /> Beranda</SidebarMenuButton></SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton><IconUsers size={16} /> Anggota</SidebarMenuButton>
                  <SidebarMenuBadge>128</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem><SidebarMenuButton><IconSend size={16} /> Pengumuman</SidebarMenuButton></SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem><SidebarMenuButton><IconLogout size={16} /> Keluar</SidebarMenuButton></SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <div style={{ padding: 16 }}>
            <SidebarTrigger />
            <p style={{ color: "#5b6168", margin: "12px 0 0", maxWidth: 520 }}>
              Tombol menu membuka dan menutup sidebar. Ubah side, variant, dan collapsible dari panel controls.
            </p>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
};
