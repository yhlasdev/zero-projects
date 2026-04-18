import { Box } from "@mui/material"
import Avatar from "@mui/material/Avatar"
import Card from "@mui/material/Card"
import { CardRow } from './cardRow'
import { CardBtn } from './cardBtn'

export const RequestCard = ({ hasBtn, status, user_id }) => {
    return (
        <Card sx={{
            p: 2,
            borderRadius: '8px',
            border: '1px solid #eeeeee',
            boxShadow: 'none',
            minWidth: '240px'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}>
                <Avatar src={user_id ? `http://194.156.117.223:8004/yerinde/storage-service/avatar/${user_id}/100x100` : ""} />
                <CardRow prefix={'First Name:'} suffix={'Alexandra'} />
                <CardRow prefix={'First Name:'} suffix={'Alexandra'} />
                <CardRow prefix={'First Name:'} suffix={'Alexandra'} />
                <CardRow prefix={'First Name:'} suffix={'Alexandra'} />

                <Box
                    alignSelf={'flex-start'}
                    className=' pl-2 pr-2 request-status rounded-xl bg-amber-400 text-red-500 text-center shrink-0 '>
                    {status}
                </Box>

                {hasBtn &&
                    <Box sx={{
                        display: 'flex',
                        gap: 1,
                        justifyContent: 'space-between'
                    }}>
                        <CardBtn name={'Reject'} bgColor={'bg-red-500'} />
                        <CardBtn name={'Approved'} bgColor={'bg-green-500'} />
                    </Box>}

            </Box>
        </Card>
    )
}