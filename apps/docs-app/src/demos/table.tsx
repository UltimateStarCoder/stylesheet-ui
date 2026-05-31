import { ScrollView } from "react-native";
import {
  Badge,
  Table,
  createStyles,
  type TableColumn,
} from "@stylesheet-ui/ui";

type User = {
  id: string;
  name: string;
  role: string;
  status: "active" | "invited" | "disabled";
};

const USERS: User[] = [
  { id: "1", name: "Ada Lovelace",       role: "Owner",  status: "active"   },
  { id: "2", name: "Grace Hopper",       role: "Admin",  status: "active"   },
  { id: "3", name: "Margaret Hamilton",  role: "Editor", status: "invited"  },
  { id: "4", name: "Katherine Johnson",  role: "Viewer", status: "disabled" },
];

const statusVariant: Record<User["status"], "success" | "secondary" | "outline"> = {
  active:   "success",
  invited:  "secondary",
  disabled: "outline",
};

const columns: TableColumn<User>[] = [
  { key: "name", header: "Name", flex: 2 },
  { key: "role", header: "Role", flex: 1 },
  {
    key: "status",
    header: "Status",
    flex: 1,
    render: (row) => <Badge size="sm" variant={statusVariant[row.status]}>{row.status}</Badge>,
  },
];

const useStyles = createStyles((t) => ({
  container: {
    padding: t.spacing.lg,
    backgroundColor: t.colors.background,
    flexGrow: 1,
  },
}));

export default function TableDemo() {
  const styles = useStyles();
  return (
    <ScrollView contentContainerStyle={styles.container} testID="screen-table">
      <Table columns={columns} data={USERS} keyExtractor={(u) => u.id} testID="table-default" />
    </ScrollView>
  );
}
