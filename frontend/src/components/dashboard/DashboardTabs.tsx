import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import MyCapsules from "./MyCapsules";
import CreateCapsule from "./CreateCapsule";
import FriendsVaults from "./FriendsVaults";
import Discovery from "./Discovery";

const DashboardTabs = ({ capsules, onCapsuleCreated }) => {
  return (
    <Tabs defaultValue="my-capsules" className="w-full">
      <TabsList className="bg-card border border-border/50 h-12 p-1 gap-1">
        <TabsTrigger 
          value="my-capsules"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2 rounded-md transition-all"
        >
          My Capsules
        </TabsTrigger>
        <TabsTrigger 
          value="create-new"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2 rounded-md transition-all"
        >
          Create New
        </TabsTrigger>
        <TabsTrigger 
          value="friends-vaults"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2 rounded-md transition-all"
        >
          Friends' Vaults
        </TabsTrigger>
        <TabsTrigger 
          value="discovery"
          className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2 rounded-md transition-all"
        >
          Discovery
        </TabsTrigger>
      </TabsList>

      <TabsContent value="my-capsules" className="mt-6">
        <MyCapsules capsules={capsules} />
      </TabsContent>
      <TabsContent value="create-new" className="mt-6">
        <CreateCapsule onCapsuleCreated={onCapsuleCreated} />
      </TabsContent>
      <TabsContent value="friends-vaults" className="mt-6">
        <FriendsVaults />
      </TabsContent>
      <TabsContent value="discovery" className="mt-6">
        <Discovery />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
