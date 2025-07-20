import {TreeItem} from "@/lib/utils";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup, SidebarGroupContent, SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem, SidebarMenuSub,
    SidebarProvider, SidebarRail
} from "@/components/ui/sidebar";
import {ChevronRightIcon, FileIcon, FolderIcon} from "lucide-react";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible";

type Props = {
    data: TreeItem[]
    onSelect?: (item: string) => void;
    value?: string | null;
};
export default function TreeView({
    data,
    onSelect = () => {},
    value = null
                                 }: Props) {
    console.log(data)
    return (
        <SidebarProvider className={"h-full"}>
            <Sidebar collapsible="none" className="w-full bg-muted !text-foreground">
                <SidebarContent className="">
                    <SidebarGroup className="">
                        <SidebarGroupContent className="">
                            <SidebarMenu>
                                {data.map((item, index) => (
                                    <Tree
                                        key={index}
                                        item={item}
                                        onSelect={onSelect}
                                        selectedValue={value}
                                        parentPath=""
                                    />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    );
};

type TreeProps = {
    item: TreeItem
    onSelect?: (item: string) => void;
    selectedValue?: string | null;
    parentPath: string

}
const Tree = ({
                  item,
                  onSelect = () => {
                  },
                  selectedValue = null,
                  parentPath
              }: TreeProps) => {
    const [name, ...items] = Array.isArray(item) ? item : [item];
    const path = parentPath ? `${parentPath}/${name}` : name;

    if (items.length === 0) {
        const isSelected = selectedValue === path;

        return (
            <SidebarMenuButton
                isActive={isSelected}
                className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground cursor-pointer hover:bg-primary/20 hover:text-foreground"
                onClick={() => onSelect?.(path)}
            >
                <FileIcon/>
                <span className="truncate">{name}</span>
            </SidebarMenuButton>
        )
    }

    return (
        <SidebarMenuItem>
            <Collapsible
                className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90
                [&[data-state=open]>button>svg:first-child]:transition-transform"
                defaultOpen
            >
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="cursor-pointer hover:!bg-primary/20 hover:!text-foreground">
                        <ChevronRightIcon/>
                        <FolderIcon/>
                        <span className="truncate">{name}</span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub className="mr-0">
                        {items.map((subItem, index) => (
                            <Tree
                                key={`${path}-${index}`}
                                item={subItem}
                                onSelect={onSelect}
                                selectedValue={selectedValue}
                                parentPath={path}
                            />
                        ))}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
}